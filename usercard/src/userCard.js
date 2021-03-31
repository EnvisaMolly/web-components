const template = document.createElement('template');
template.innerHTML = `
  <style>
  .user-card {
		font-family: 'Arial', sans-serif;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: darkorchid 5px solid;
	}

	.user-card img {
		width: 100%;
	}

	.user-card button {
		cursor: pointer;
		background: darkorchid;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}
  </style>
  <div class="user-card">
    <img />
    <div>
      <h3></h3>
      <div class="info">
        <p><slot name="email" /></p>
        <p><slot name="phone" /></p>
      </div>
      <button id="toggle-info">Hide Info</button>
    </div>
  </div>
`;

class UserCard extends HTMLElement {
  constructor() {
    super();

    // Visa kontaktinfo
    this.showInfo = true;

    // Skapa shadowDOM append template ovanför
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    // Hämtar h3 i template och lägger till texten som är i HTML filen i name (name="exempel")
    this.shadowRoot.querySelector('h3').innerText = this.getAttribute('name');
    // Hämtar img i template och lägger till bilden som är i HTML filen i name (avatar="exempel")
    this.shadowRoot.querySelector('img').src = this.getAttribute('avatar');
  }

  // När man klickar på hide info
  toggleInfo() {

    // gör showInfo till false
    this.showInfo = !this.showInfo;

    // Hämta info klassen
    const info = this.shadowRoot.querySelector('.info');
    // Hämta toggle-info id
    const toggleBtn = this.shadowRoot.querySelector('#toggle-info');

    // Om showInfo är true
    if(this.showInfo) {
      // Visa info
      info.style.display = 'block';
      // Byt texten inuti knappen till Hide Info
      toggleBtn.innerText = 'Hide Info';
    } else {
      // Visa ej info
      info.style.display = 'none';
      // Byt texten inuti knappen till Show Info
      toggleBtn.innerText = 'Show Info';
    }
  }

  // Hämtar id toggle-info lägger till ett click event
  connectedCallback() {
    this.shadowRoot.querySelector('#toggle-info').addEventListener('click', () => this.toggleInfo());
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('#toggle-info').removeEventListener();
  }
}

// Kopplar user-card custom elementet med UserCard klassen
window.customElements.define('user-card', UserCard);