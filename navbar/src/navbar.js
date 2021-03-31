const template = document.createElement('template');
template.innerHTML = `
  <style>

    .nav-bar-example {
      background-color: #333;
      overflow: hidden;
    }

    .nav-bar-example a {
      float: left;
      color: #f2f2f2;
      text-align: center;
      padding: 14px 16px;
      text-decoration: none;
      font-size: 17px;
    }

    .nav-bar-example a:hover {
      background-color: #ddd;
      color: black;
    }

    .nav-list {
      list-style-type: none;
      margin: 0;
      padding: 0;
    }


  </style>
  <div class="nav-bar-example">
    <ul class="nav-list">
    <li><a href="default.asp">Home</a></li>
    <li><a href="news.asp">News</a></li>
    <li><a href="contact.asp">Contact</a></li>
    <li><a href="about.asp">About</a></li>
    </ul> 
  </div>
`;

class NavBar extends HTMLElement {
  constructor() {
    super();


    // Skapa shadowDOM append template ovanför
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

// Kopplar user-card custom elementet med UserCard klassen
window.customElements.define('nav-bar-example', NavBar);