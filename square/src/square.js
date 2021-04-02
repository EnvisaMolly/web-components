const template = document.createElement('template');
template.innerHTML = `
  <style>

    .square-example {
      height:300px;
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
      height: 300px;
      text-align:center;
      display: block;
      margin: auto;
    }

    #easyGame, #mediumGame, #hardGame, #restart {
      background-color:pink;
      margin: auto;
      margin-top: 35px;
      border-radius:5px;
      height:50px;
      width:200px;
      display:block;
      text-align:center;
      font-size: 120%;
    }

    #restart {
      display: none;
      margin-top: 120px;
    }

    .scoreBox{
      display:inline-block;
      width: 500px;
      text-align:center;
      display: none;
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
      // border: 1px solid black;
      box-shadow: 2px 2px #88888825;
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
      <button id="easyGame">Easy</button>
      <button id="mediumGame">Medium</button>
      <button id="hardGame">Hard</button>
    </div>

    <div class="scoreBox">
      <h4 id="noOfMatches">Matches found: <span id="matchesFound"></span></h4>
      <h4 id="noOfTries">Total tries: <span id="totalTries">0</span></h4>
    </div>

    <div class="box">
    </div>

    <button id="restart">Play Again</button>
  </div>
`;

class Square extends HTMLElement {
  constructor() {
    super();

    this.clickedCard = null;
    this.preventClick = false;
    this.combosFound = 0;
    this.triesDone = 0;
    this.numberOfCards = 0;

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

  startGame(rows) {

    // Hämta container, square-example, scoreBox, startBox
    const box = this.shadowRoot.querySelector('.box');
    const square = this.shadowRoot.querySelector('.square-example');
    const scoreBox = this.shadowRoot.querySelector('.scoreBox');
    const startBox = this.shadowRoot.querySelector('#startBox');

    // Visa scoreBox när spelet startar
    scoreBox.style.display = "inline-block"

    // Visa ej startBox när spelet startar
    startBox.style.display = "none"


    // Skapa container
    const cont = '<div class="container"></div>'
    box.innerHTML = cont;

    // Hämta container
    const container = this.shadowRoot.querySelector('.container');

    // Ändra storleken på rutan beroende på svårhetsgraden på spelet
    if (rows === 2) {
      square.style.height = "360px"
    } else if (rows === 3) {
      square.style.height = "470px"
    } else if (rows === 4) {
      square.style.height = "580px"
    }

    // Ändra antal kort
    this.numberOfCards = rows * 2;

    // Skriv ut antal matchningar som är gjorda
    this.shadowRoot.getElementById('matchesFound').innerHTML = `${this.combosFound} / ${this.numberOfCards}`

    // Skriv ut antal matchningar som är gjorda
    this.shadowRoot.getElementById('totalTries').innerHTML = `0`

    // Skapa spelfält
    let grid = ''

    // Skapa memory korten
    for (let i = 0; i < rows; i++) {
      grid += '<div class="row"> <div class="card"> </div> <div class="card"> </div> <div class="card"> </div> <div class="card"> </div> </div>'
    }
    // Lägg till på spelplanen
    container.innerHTML = grid;

    // Alla möjliga kort som finns
    const allColors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'grey', 'black']

    // De kort som ska användas
    const colors = []

    for (let i = 0; i < this.numberOfCards; i++) {
      colors.push(allColors[i])
    }

    // Lägg till attribut på korten
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

        // Om man hittat alla möjliga kombinationer
        if (this.combosFound === this.numberOfCards) {
          alert('Congrats you found them all')
          // Hämta restart knapp, container
          let restart = this.shadowRoot.getElementById('restart');
          const container = this.shadowRoot.querySelector('.container');
          const square = this.shadowRoot.querySelector('.square-example');
          const scoreBox = this.shadowRoot.querySelector('.scoreBox');

          // Ta bort memoryspel
          container.parentNode.removeChild(container)

          // Visa restart knapp, visa ej score fält, ändra storlek på rutan
          restart.style.display = "inline-block"
          scoreBox.style.display = "none"
          square.style.height = ""
        }
      }
    }
  }

  playAgain(){
    this.combosFound = 0;
    this.triesDone = 0;
    const startBox = this.shadowRoot.querySelector('#startBox');
    startBox.style.display = "block"
  }

  // Hämtar id exit lägger till ett click event
  connectedCallback() {
    this.shadowRoot.querySelector('#exit').addEventListener('click', () => this.exitWindow());
    this.shadowRoot.querySelector('#easyGame').addEventListener('click', () => this.startGame(2));
    this.shadowRoot.querySelector('#mediumGame').addEventListener('click', () => this.startGame(3));
    this.shadowRoot.querySelector('#hardGame').addEventListener('click', () => this.startGame(4));
    this.shadowRoot.querySelector('#restart').addEventListener('click', () => this.playAgain());
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
