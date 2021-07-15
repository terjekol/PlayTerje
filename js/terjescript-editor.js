(function () {
    class TerjeScriptEditor extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <svg viewBox="0 0 100 100">
                </svg>
                <style>
                    svg {
                        background-color: lightgray;
                        width: 50%;
                    }
                </style>
                `;
        }

        connectedCallback() {
            this.svg = this.shadowRoot.children[0];
            this.path = this.getAttribute('path');
            this.updateView();
        }

        updateView() {
            this.svg.innerHTML = /*html*/`
            `;
        }
    }

    customElements.define('terjescript-editor', TerjeScriptEditor);
})();