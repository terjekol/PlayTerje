(function () {
    class CodeEditor extends HTMLElement {
        constructor() {
            super();
            const name = this.getAttribute('name') || 'funksjon1';
            const codeName = toCamelCase(name);
            this.model = {
                name: name,
                codeName: codeName,
                selectedLineIndex: 1,
                lines: [
                    { code: `function ${codeName}() {` },
                    { code: '', edit: true },
                    { code: '}' },
                ],
                booleanExpressions: [
                    'false',
                    'true',
                    'gå()',
                    '!gå()',
                    'erVedUtgang()',
                    '!erVedUtgang()',
                ],
            };

            document.addEventListener('keydown', this.handleKeys.bind(this));

            this.div = document.createElement('div');
            const style = document.createElement('style');
            style.innerHTML = getStyle();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(this.div);
            this.buttons = [];
            this.updateView();
        }
        updateView() {
            this.removeEventListeners();
            const lineObj = this.model.lines[this.model.selectedLineIndex];
            this.div.innerHTML = `
                <input type="text" value="${this.model.name}" />
                <pre>${this.getFunctionCode()}</pre>
                <div>
                    <button class="lineCommand" click="this.moveSelection(-1)">▲</button>
                    <button class="lineCommand" click="this.moveSelection(1)">▼</button>
                    ${this.model.selectedLineIndex == this.model.lines.length - 1 ? '' :
                    '<button class="add lineCommand" click="this.addLine()">↵</button>'}
                    ${lineObj.edit ? '<button class="delete lineCommand" click="this.deleteLine()">×</button>' : ''}
                </div>                
                ${this.createCommandsHtml()}
                <br/>
                `;
            this.addEventListeners();
            if (this.model.requestFocus) {
                this.input.focus();
                this.input.setSelectionRange(this.model.requestFocus.selectionStart, this.model.requestFocus.selectionEnd);
                this.model.requestFocus = null;
            }
        }
        getFunctionCode(hideSelection) {
            const tmpSelection = this.model.selectedLineIndex;
            if (hideSelection) this.model.selectedLineIndex = -1;
            const startState = { HTML: '', currentLevel: 0 };
            const html = this.model.lines.reduce(this.formatCodeLine.bind(this), startState).HTML;
            if (hideSelection) this.model.selectedLineIndex = tmpSelection;
            return html;
        }

        setFunctionCode(code) {
            this.model.selectedLineIndex = 1;
            this.model.lines = code.split('\n').map(
                function (line, index) { return { code: line, edit: index !== 0 && !line.includes('}') } }
            );
            this.updateView();
        }
        removeEventListeners() {
            for (let btn of this.buttons) {
                btn.onclick = null;
            }
            if (this.select) this.select.onchange = null;
            if (this.input) this.input.oninput = null;
        }
        addEventListeners() {
            this.buttons = this.div.getElementsByTagName('button');
            for (let btn of this.buttons) {
                btn.onclick = this.handleButtonClick.bind(this);
            }
            const selects = this.div.getElementsByTagName('select');
            if (selects.length > 0) {
                this.select = selects[0];
                this.select.onchange = this.handleSelectChange.bind(this);
            }
            this.input = this.div.getElementsByTagName('input')[0];
            this.input.oninput = this.handleInputChange.bind(this);
        }
        createCommandsHtml() {
            const lineObj = this.model.lines[this.model.selectedLineIndex];
            if (!lineObj.edit) return '';
            return `
                <div>
                    <button class="code" click="this.changeLine(btn.innerHTML)">gå()</button>
                    <button class="code" click="this.changeLine(btn.innerHTML)">snuHøyre()</button>
                    <button class="code" click="this.changeLine(btn.innerHTML)">erVedUtgang()</button>
                    <button class="code italic" click="this.changeLine(btn.innerHTML)">if</button>
                    <button class="code italic" click="this.changeLine(btn.innerHTML)">while</button>
                </div>
            `;
        }
        formatCodeLine(state, lineObj, index) {
            if (lineObj.code === '}') state.currentLevel--;
            state.HTML += this.indent(state.currentLevel);
            const isSelected = this.model.selectedLineIndex === index;
            const code = this.getCode(lineObj, index, isSelected);
            state.HTML += !isSelected ? code + '\n' :
                `<span class="selected">${code || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>\n`;
            if (lineObj.endOfBlock || index === 0) state.currentLevel++;
            return state;
        }

        getCode(lineObj, index, isSelected) {
            if (!lineObj.endOfBlock) return lineObj.code;
            if (!isSelected) return `${lineObj.code}(${lineObj.criteria}) {`;
            return `${lineObj.code}(<select onchange="changeLogicalExpression(${index}, this.value)"
                        >${this.model.booleanExpressions.map(expr => `
                            <option ${expr === lineObj.criteria ? 'selected' : ''}>${expr}</option>    
                            `).join('')}</select>) {`;
        }

        indent(level) {
            return ''.padEnd(level * 2, ' ');
        }
        // controller
        handleKeys(keyEvent) {
            if (keyEvent.code === "ArrowUp") this.moveSelection(-1);
            else if (keyEvent.code === "ArrowDown") this.moveSelection(1);
            else if (keyEvent.code === "Delete") this.deleteLine();
            else if (keyEvent.code === "Enter") this.addLine();
        }
        handleButtonClick(clickEvent) {
            const btn = clickEvent.srcElement;
            const click = btn.getAttribute('click');
            eval(click);
        }
        handleSelectChange(selectEvent) {
            const select = selectEvent.srcElement;
            this.model.lines[this.model.selectedLineIndex].criteria = select.value;
        }
        handleInputChange() {
            this.model.name = this.input.value;
            this.model.codeName = toCamelCase(this.input.value);
            this.model.requestFocus = {
                selectionStart: this.input.selectionStart,
                selectionEnd: this.input.selectionEnd,
            };
            this.model.lines[0].code = `function ${this.model.codeName}() {`;
            this.updateView();
        }
        changeLine(code) {
            const lineObj = this.model.lines[this.model.selectedLineIndex];
            if (!lineObj.edit) return;
            this.removeExistingLine();
            if (code != 'if' && code != 'while') {
                this.model.lines.splice(this.model.selectedLineIndex, 0, { code: code, edit: true, });
            } else {
                const firstLine = { code: code, edit: true, criteria: 'false' };
                const middleLine = { code: '', edit: true, };
                const lastLine = { code: '}', };
                firstLine.endOfBlock = lastLine;
                this.model.lines.splice(this.model.selectedLineIndex, 0, firstLine, middleLine, lastLine);
            }
            this.updateView();
        }

        removeExistingLine() {
            const lineObj = this.model.lines[this.model.selectedLineIndex];
            if (!lineObj.edit) return;
            if (!lineObj.endOfBlock) {
                this.model.lines.splice(this.model.selectedLineIndex, 1);
                return;
            }
            const indexEndOfBlock = this.model.lines.indexOf(lineObj.endOfBlock);
            this.model.lines.splice(this.model.selectedLineIndex, 1 + indexEndOfBlock - this.model.selectedLineIndex);
        }

        moveSelection(deltaIndex) {
            const l = this.model.lines.length;
            this.model.selectedLineIndex += deltaIndex + l;
            this.model.selectedLineIndex %= l;
            this.updateView();
        }

        deleteLine() {
            this.removeExistingLine();
            this.updateView();
        }

        addLine() {
            if (this.model.selectedLineIndex === this.model.lines.length - 1) return;
            this.model.lines.splice(this.model.selectedLineIndex + 1, 0, { code: '', edit: true });
            this.model.selectedLineIndex++;
            this.updateView();
        }
    }
    customElements.define('code-editor', CodeEditor);

    function toCamelCase(str) {
        return str.split(' ').map(function (word, index) {
            return index == 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }
    function getStyle() {
        return `
            pre {
                font-size: 2vmin;
            }

            select {
                font-family: monospace;
                font-size: 2vmin;
                background-color: rgb(247, 244, 213);
            }

            button.lineCommand {
                font-size: 2vmin;
                line-height: 3vmin;
                margin: 0.3vmin;
                min-width: 3vmin;
            }

            .selected {
                background-color: palegoldenrod;
            }

            button.add {
                color: darkgreen;
                font-weight: bolder;
            }

            button.delete {
                color: darkred;
                font-weight: bolder;
            }

            button.code {
                font-family: monospace;
            }

            button.italic {
                font-style: italic;
            }

            input {
                font-size: 2vmin;
            }
        `;
    }
})();