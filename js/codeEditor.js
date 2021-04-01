(function () {
    class CodeEditor extends HTMLElement {
        constructor() {
            super();
            this.model = {
                selectedLineIndex: 1,
                lines: [
                    { code: 'function dummy() {' },
                    { code: '', edit: true },
                    { code: '}' },
                ],
                booleanExpressions: [
                    'false',
                    'true',
                    'gå()',
                    'erVedUtgang()',
                ],
            };

            this.div = document.createElement('div');
            const style = document.createElement('style');
            style.innerHTML = getStyle();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(style);
            this.shadowRoot.appendChild(this.div);
            this.updateView();
        }
        updateView() {
            // if (this.button) this.button.onclick = null;
            // this.shadowRoot.innerHTML = `<h1>${this.count}</h1><button id="myButton">+</button>`;
            // this.button = this.shadowRoot.getElementById('myButton');
            // this.button.onclick = () => this.buttonClick();
            const lineObj = this.model.lines[this.model.selectedLineIndex];
            const startState = { HTML: '', currentLevel: 0, };
            this.div.innerHTML = `
                <pre>${this.model.lines.reduce((state, lineObj, index) => this.formatCodeLine(state, lineObj, index), startState).HTML}</pre>
                <div>
                    <button onclick="moveSelection(-1)">▲</button>
                    <button onclick="moveSelection(1)">▼</button>
                    ${this.model.selectedLineIndex == this.model.lines.length - 1 ? '' : '<button class="add" onclick="addLine()">↵</button>'}
                    ${lineObj.edit ? '<button class="delete" onclick="deleteLine()">×</button>' : ''}
                </div>
                ${this.createCommandsHtml()}
                `;
        }
        createCommandsHtml() {
            const lineObj = this.model.lines[this.model.selectedLineIndex];
            if (!lineObj.edit) return '';
            return `
                <div>
                    <button class="code" onclick="changeLine(this.innerHTML)">gå()</button>
                    <button class="code" onclick="changeLine(this.innerHTML)">snuHøyre()</button>
                    <button class="code" onclick="changeLine(this.innerHTML)">erVedUtgang()</button>
                    <button class="code italic" onclick="changeLine(this.innerHTML)">if</button>
                    <button class="code italic" onclick="changeLine(this.innerHTML)">while</button>
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
            return `${lineObj.code}(
                        <select onchange="changeLogicalExpression(${index}, this.value)">
                            ${this.model.booleanExpressions.map(expr => `
                            <option ${expr === lineObj.criteria ? 'selected' : ''}>${expr}</option>    
                            `).join('')}
                        </select>) {`;
        }

        indent(level) {
            return ''.padEnd(level * 2, ' ');
        }
        buttonClick() {
            this.count++;
            this.updateView();
        }
    }
    customElements.define('code-editor', CodeEditor);

    function getStyle() {
        return `
            pre {
                font-size: 3.5vmin;
                width: 300px;
            }

            select {
                font-family: monospace;
                font-size: 3.5vmin;
                background-color: rgb(247, 244, 213);
            }

            button {
                font-size: 3.5vmin;
                line-height: 4.5vmin;
                margin: 0.2vmin;
                min-width: 6vmin;
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
        `;
    }
})();