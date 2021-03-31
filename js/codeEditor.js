(function () {
    class CodeEditor extends HTMLElement {
        constructor() {
            super();
            // this.addEventListener('click',
            // () => {
            //      this.style.color === 'red'
            //      ? this.style.color = 'blue':
            //       this.style.color = 'red';
            // });

        }
        connectedCallback() {
            this.style.color = 'blue';

            const template =
                document.querySelector('template');

            const clone =
                document.
                    importNode(template.content, true);

            //this.appendChild(clone);
            this.attachShadow({ mode: 'open' });
            this.shadowRoot.appendChild(clone);
        }
    }
    customElements.define('code-editor', CodeEditor);
})();