(function () {
    class TerjeScriptEditor extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <div></div>
                <style>
                    button {
                        font-size: 75%;
                    }
                </style>
                `;
            this.root = this.shadowRoot.children[0];
        }
        updateView() {
            this.removeEventListeners();
            this.root.innerHTML = /*html*/`
                <ol>
                    ${this.core.program.main.map((step, index) => /*html*/`
                    <li>
                        ${step.command.name}
                        ${Object.keys(step.args).map(key => `${key}: ${step.args[key]}`).join(', ')}
                        <button data-onclick="this.core.moveCommandInProgram(${index},-1)">▲</button>
                        <button data-onclick="this.core.moveCommandInProgram(${index},1)">▼</button>
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