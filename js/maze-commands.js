(function () {
    class MazeCommands extends HTMLElement {
        constructor() {
            super();
            this.model = {};
            this.attachShadow({ mode: 'open' });
            this.onclick = null;
            this.shadowRoot.innerHTML = `
                <button id="btn1" class="command" click="gå()">Gå</button>
                <button id="btn2" class="command" click="snuHøyre()">Snu høyre</button>
                <button id="btn3" class="command" click="erVedUtgang()">Er ved utgang?</button>
                <br/>
                `;
            const style = document.createElement('style');
            style.innerText = getStyle();
            this.shadowRoot.appendChild(style)
            this.div = document.createElement('div');
            this.div.classList.add('code');
            this.shadowRoot.appendChild(this.div);
        }

        connectedCallback() {
            this.btnGo = this.shadowRoot.getElementById('btn1');
            this.btnTurnRight = this.shadowRoot.getElementById('btn2');
            this.btnIsAtExit = this.shadowRoot.getElementById('btn3');
            this.btnGo.onclick = this.handleClick.bind(this);
            this.btnTurnRight.onclick = this.handleClick.bind(this);
            this.btnIsAtExit.onclick = this.handleClick.bind(this);
        }

        handleClick(clickEvent) {
            const btn = clickEvent.srcElement;
            const code = btn.getAttribute('click');
            if (!this.onclick) return;
            const returnValue = this.onclick(code);
            this.model.lastCommand = { code, returnValue:quotify(returnValue) };
            this.updateView();
        }

        updateView(){            
            this.div.innerHTML = `
                <span style="color: gray">Kommando: &nbsp;</span>
                ${this.model.lastCommand.code}
                <br/>
                <span style="color: gray">Returverdi: </span>${this.model.lastCommand.returnValue}
            `;
        }

        createButton(click, text) {
            const btn = document.createElement('button');
            btn.classList.add('command');
            btn.setAttribute('click', click);
            btn.innerText = text;
        }
    }

    function getStyle() {
        return `        
            button.command {
                font-size: 150%;
                background-color: green;
                color: white;
            }
            
            .code {
                font-family: monospace;
                font-size: 150%;
            }
        `;
    }

    function quotify(value) {
        return typeof (value) === 'string' ? `'${value}'` : value;
    }

    customElements.define('maze-commands', MazeCommands);
})();