const template = document.createElement('template');
template.innerHTML = `
  <style>

    .square-example {
      height:600px;
      width:500px;
      border:1px solid black;
      overflow: hidden;
      border-radius:5px;
      box-shadow: 5px 5px #88888825;
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

    .container {
      margin-top: 50px;
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
      background-image: url("Images/red1.png"); 
    }

    .red.done:hover {
      background-image: url("Images/red1.png"); 
    }
    
    .green {
      background-image: url("Images/green1.png"); 
    }
    
    .green.done:hover {
      background-image: url("Images/green1.png"); 
    }
    
    .blue {
      background-image: url("Images/blue1.png"); 
    }
    .blue.done:hover {
      background-image: url("Images/blue1.png"); 
    }
    
    .yellow {
      background-image: url("Images/yellow1.png");
    }
    
    .yellow.done:hover {
      background-image: url("Images/yellow1.png");
    }
    
    .orange {
      background-image: url("Images/orange1.png");
    }
    
    .orange.done:hover {
      background-image: url("Images/orange1.png"); 
    }
    
    .purple {
      background-image: url("Images/purple1.png");
    }
    
    .purple.done:hover {
      background-image: url("Images/purple1.png");
    }
    
    .grey {
      background-image: url("Images/grey1.png");
    }
    
    .grey.done:hover {
      background-image: url("Images/grey1.png");
    }
    
    .black {
      background-image: url("Images/black1.png");
    }
    
    .black.done:hover {
      background-image: url("Images/black1.png");
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

    <div class="box">
      <div class="container">

        <div class="row"> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
        </div>

        <div class="row"> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
        </div>

        <div class="row"> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
        </div>

        <div class="row"> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
          <div class="card"> </div> 
        </div>

      </div>
    </div>
  </div>
`;

class Square extends HTMLElement {
  constructor() {
    super();

    this.clickedCard = null
    this.preventClick = false,
      this.combosFound = 0

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
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'grey', 'black']

    console.log(colors)

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
    // console.log(cards)
    for (let i = 0; i < cards.length; i++) {
      cards[i].className += ' card-back'
      // cards[i].setAttribute('onclick', 'chosenCard(event)')
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
        // gameBoard.triesDone++
        // document.getElementById('tries').innerHTML = `Number of tries: ${gameBoard.triesDone}`
        setTimeout(() => {
          this.clickedCard.className = this.clickedCard.className.replace('done', '').trim() + (' card-back')
          target.className = target.className.replace('done', '').trim() + (' card-back')
          this.clickedCard = null
          this.preventClick = false
        }, 500)
      } else {
        // gameBoard.triesDone++
        this.combosFound++
        this.clickedCard = null

        // document.getElementById('match').innerHTML = `Number of matches: ${gameBoard.combosFound} / ${gameBoard.numberOfCards}`
        // document.getElementById('tries').innerHTML = `Number of tries: ${gameBoard.triesDone}`

        if (this.combosFound === 8) {
          alert('Congrats you found them all')
        }
      }
    }
  }

  // Hämtar id exit lägger till ett click event
  connectedCallback() {
    this.shadowRoot.querySelector('#exit').addEventListener('click', () => this.exitWindow());
    this.shadowRoot.querySelector('#startGame').addEventListener('click', () => this.startGame());

    const cards = this.shadowRoot.querySelectorAll('.card')
    for (let i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', () => this.chosenCard(cards[i]));
    }
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
