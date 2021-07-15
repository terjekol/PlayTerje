(function () {
    class TerjeScriptCanvas extends HTMLElement {
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
        }

        updateView(path) {
            this.svg.innerHTML = /*html*/`
                <path 
                    d="M 0 0 ${path}" 
                    stroke="green"
                    fill="none"
                    />
            `;
            new Vivus(this.svg);
        }
    }

    customElements.define('terjescript-canvas', TerjeScriptCanvas);
})();