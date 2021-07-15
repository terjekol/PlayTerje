(function () {
    function createStepHtml(step) {
        const name = step.command.name;
        return name + '()';
    }

    class TerjeScriptEditor extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }
        updateView() {
            this.shadowRoot.innerHTML = /*html*/`
                <ol>
                    ${this.core.program.main.map(step=>`
                    <li>
                        ${step.command.name}
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