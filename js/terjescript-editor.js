(function () {
    class TerjeScriptEditor extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = /*html*/`
                <div></div>
                <style>
                    button {
                        font-size: 75%;
                    }
                    li{
                        padding: 1vmin;
                    }
                    li.selected {
                        background-color: goldenrod;
                    }
                </style>
                `;
            this.root = this.shadowRoot.children[0];
        }
        connectedCallback(){
            this.programIndex = parseInt(this.getAttribute('data-program-index'));
        }
        updateView() {
            this.removeEventListeners();
            const selectedIndex = this.core.getSelectedIndex(this.programIndex);
            this.root.innerHTML = /*html*/`
                <ol>
                    ${this.core.getSteps(this.programIndex).map((step, index) => /*html*/`
                    <li class="${selectedIndex===index?'selected':''}">
                        ${step.command.name}
                        ${Object.keys(step.args).map(key => `${key}: ${step.args[key]}`).join(', ')}
                        ${selectedIndex===index?/*html*/`
                        <button data-onclick="this.core.moveCommandInProgram(-1)">▲</button>
                        <button data-onclick="this.core.moveCommandInProgram(1)">▼</button>
                        <button data-onclick="this.core.deleteCommandInProgram()">×</button>
                        `:/*html*/`
                        <button data-onclick="this.core.setSelectedIndex(${index}, ${this.programIndex})">velg</button>
                        `}
                    </li>
                    `).join('')}
                </ol>
            `;
            this.addEventListeners();
        }
        removeEventListeners() {
            for (let btn of this.shadowRoot.querySelectorAll('button')) {
                btn.removeEventListener('click', this.btnClick.bind(this));
            }
        }
        addEventListeners() {
            for (let btn of this.shadowRoot.querySelectorAll('button')) {
                btn.addEventListener('click', this.btnClick.bind(this));
            }
        }
        btnClick(clickEvent){
            const btn = clickEvent.srcElement;
            const onclick = btn.getAttribute('data-onclick');
            eval(onclick);
            this.updateView();
        }

        registerCore(core) {
            this.core = core;
            this.updateView();
        }
    }

    customElements.define('terjescript-editor', TerjeScriptEditor);
})();