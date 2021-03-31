const template = document.createElement('template');
template.innerHTML = `
  <style>
  .test-out {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: darkorchid 5px solid;
	}
	}
  </style>
  <h3 class="test-out">
    Hello
  </h3>
`;

class TestOut extends HTMLElement {
  constructor() {
    super();


    // Skapa shadowDOM append template ovanför
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

// Kopplar user-card custom elementet med UserCard klassen
window.customElements.define('test-out', TestOut);