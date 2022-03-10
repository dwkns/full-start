import {LitElement, html} from 'lit';

export class MyElement extends LitElement {
  static properties = {
    name: {},
  };

  constructor() {
    super();
    this.name = 'This Element';
  }

  createRenderRoot() {
    return this; // turn off shadow dom to access external styles
  }

  
  render() {
    return html`
      <div class="text-[69px] text-blue-500">Hello World</div>
    `;
  }
}

customElements.define('my-element', MyElement);