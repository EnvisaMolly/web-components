const template = document.createElement('template');
template.innerHTML = `
  <style>

    .square-example {
      height:650px;
      width:500px;
      border:1px solid black;
      overflow: hidden;
      border-radius:5px;
      box-shadow: 5px 5px #88888825;
      text-align: center;
    }

    #exit {
      background-image: url('./images/215904-200.png');
      width: 20px;
      height: 20px;
      text-align: center;
      float:right;
    }

    #startBox{
      text-align:center;
    }

    #startGame {
      background-color:pink;
      margin-top:20px;
      border-radius:5px;
      height:50px;
      width:100px;
    }

    .scoreBox{
      display:inline-block;
      width: 500px;
      text-align:center;
    }

    #noOfMatches {
      width: 200px;
      float: left;
      margin-left: 30px;
    }
    #noOfTries {
      width: 200px;
      float: right;
    }

    .container {
      margin-top: 20px;
      display: block;
    }

    .row{
      text-align: center;
    }

    .card{
      display: inline-block;
      width: 100px;
      height: 100px;
      border-radius: 5px;
      cursor: pointer;
      border: 1px solid black;
      margin: 5px;
      box-sizing: border-box;
      background:url(./images/SlackLogo.png);
    }

    .card:hover{
      background:url(./images/SLogo.png);
    }

    .red {
      background-image: url("Images/red.png"); 
    }

    .red.done:hover {
      background-image: url("Images/red.png"); 
    }
    
    .green {
      background-image: url("Images/green.png"); 
    }
    
    .green.done:hover {
      background-image: url("Images/green.png"); 
    }
    
    .blue {
      background-image: url("Images/blue.png"); 
    }
    .blue.done:hover {
      background-image: url("Images/blue.png"); 
    }
    
    .yellow {
      background-image: url("Images/yellow.png");
    }
    
    .yellow.done:hover {
      background-image: url("Images/yellow.png");
    }
    
    .orange {
      background-image: url("Images/orange.png");
    }
    
    .orange.done:hover {
      background-image: url("Images/orange.png"); 
    }
    
    .purple {
      background-image: url("Images/purple.png");
    }
    
    .purple.done:hover {
      background-image: url("Images/purple.png");
    }
    
    .grey {
      background-image: url("Images/grey.png");
    }
    
    .grey.done:hover {
      background-image: url("Images/grey.png");
    }
    
    .black {
      background-image: url("Images/black.png");
    }
    
    .black.done:hover {
      background-image: url("Images/black.png");
    }
    
    .card-back {
      background-image: url("Images/SlackLogo.png");
    }

  </style>
  <div class="square-example">
    <div id="exit"></div>
    <div id="startBox">
      <button id="startGame">Start Game</button>
    </div>

    <div class="scoreBox">
      <h4 id="noOfMatches">Matches found: <span id="matchesFound">0 / 8</span></h4>
      <h4 id="noOfTries">Total tries: <span id="totalTries">0</span></h4>
    </div>

    <div class="box">
      <div class="container">

      </div>
    </div>
  </div>
`;

class Square extends HTMLElement {
  constructor() {
    super();

    this.clickedCard = null;
    this.preventClick = false;
    this.combosFound = 0;
    this.triesDone = 0;
    this.numberOfCards = 8;

    // Skapa shadowDOM append template ovanför
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  exitWindow() {
    // Hämta square klassen
    const currentSquare = this.shadowRoot.querySelector('.square-example');
    // Ta bort rutan
    currentSquare.parentNode.removeChild(currentSquare)
  }

  startGame() {
    // Hämta square klassen
    const container = this.shadowRoot.querySelector('.container');

    let grid = ''
    let numberOfRows = this.numberOfCards / 2;

    for (let i = 0; i < numberOfRows; i++) {
      grid += '<div class="row"> <div class="card"> </div> <div class="card"> </div> <div class="card"> </div> <div class="card"> </div> </div>'
    }

    container.innerHTML = grid;

    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'grey', 'black']

    const cardColor = [...this.shadowRoot.querySelectorAll('.card')]
    for (const color of colors) {
      const cardAIndex = parseInt(Math.random() * cardColor.length)
      const cardA = cardColor[cardAIndex]
      cardColor.splice(cardAIndex, 1)
      cardA.className += ` ${color}`
      cardA.setAttribute('data-color', color)

      const cardBIndex = parseInt(Math.random() * cardColor.length)
      const cardB = cardColor[cardBIndex]
      cardColor.splice(cardBIndex, 1)
      cardB.className += ` ${color}`
      cardB.setAttribute('data-color', color)
    }

    const cards = this.shadowRoot.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++) {
      cards[i].className += ' card-back'
      cards[i].addEventListener('click', () => this.chosenCard(cards[i]));
    }
  }

  chosenCard(e) {
    const target = e
    if (this.preventClick || target === this.clickedCard || target.className.includes('done')) {
      return
    }

    // Tar bort klass från div element
    target.className = target.className.replace('card-back', '').trim()
    target.className += ' done'

    // om vi inte har klickat på kort
    if (!this.clickedCard) {
      this.clickedCard = target

      // om vi har klickat på kort, se så matchar
    } else if (this.clickedCard) {
      if (this.clickedCard.getAttribute('data-color') !== target.getAttribute('data-color')) {
        this.preventClick = true
        this.triesDone++
        this.shadowRoot.getElementById('totalTries').innerHTML = `${this.triesDone}`
        setTimeout(() => {
          this.clickedCard.className = this.clickedCard.className.replace('done', '').trim() + (' card-back')
          target.className = target.className.replace('done', '').trim() + (' card-back')
          this.clickedCard = null
          this.preventClick = false
        }, 500)
      } else {
        this.triesDone++
        this.combosFound++
        this.clickedCard = null

        this.shadowRoot.getElementById('matchesFound').innerHTML = `${this.combosFound} / ${this.numberOfCards}`
        this.shadowRoot.getElementById('totalTries').innerHTML = `${this.triesDone}`

        if (this.combosFound === this.numberOfCards) {
          alert('Congrats you found them all')
        }
      }
    }
  }

  // Hämtar id exit lägger till ett click event
  connectedCallback() {
    this.shadowRoot.querySelector('#exit').addEventListener('click', () => this.exitWindow());
    this.shadowRoot.querySelector('#startGame').addEventListener('click', () => this.startGame());
   }
}

// Kopplar spuare-example custom elementet med Spuare klassen
window.customElements.define('square-example', Square);

// Hämtar button
const openWindow = document.getElementById('openWindow')

// Om man klickar på Memoryknappen
openWindow.onclick = (number) => {
  // Skapa nytt element
  const memory = document.createElement('square-example')
  // Lägg till element i body
  document.body.appendChild(memory)
}
