(function () {
    class TerjeScriptEditor extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        updateView() {
            this.shadowRoot.innerHTML = /*html*/`
                <ol>
                    ${this.core.program.main.map(step => `
                    <li>
                        ${step.command.name}
                        ${Object.keys(step.args).map(key=>`${key}: ${step.args[key]}`).join(', ')}
                    </li>
                    `).join('')}
                </ol>
            `;
        }
        registerCore(core) {
            this.core = core;
            this.updateView();
        }
    }

    customElements.define('terjescript-editor', TerjeScriptEditor);
})();