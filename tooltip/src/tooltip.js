const template = document.createElement('template')
template.innerHTML = `

  <style>

    .tooltip-container{
      display:inline-block;
      position:relative;
      z-index:2;
    }

    .alert {
      width: 15px;
      height: 20px;
      cursor: pointer;
      background-color: blue;
      border-radius:10px;
      text-align:center;
      font-size: 75%;
      color: white;
    }

    .cancel {
      display: none;
      width: 15px;
      height: 20px;
      cursor: pointer;
      background-color: red;
      border-radius:10px;
      text-align:center;
      font-size: 75%;
      color: white;
    }

    .notify-container{
      position:absolute;
      bottom: 125%;
      z-index:9;
      width: 300px;
      background: white;
      box-shadow: 5px 5px 10px rgba(0,0,0,0.1);
      font-size: .8em;
      border-radius: .5em;
      padding: 1em;
      transform: scale(0);
      transform-origin: bottom left;
      transition: transform .5s cubic-bezier(0.860, 0.000, 0.070, 1.000);
    }
  
  </style>

  <div class="tooltip-container">
    <div class="alert"> ! </div>
    <div class="cancel"> X </div>
    <div class="notify-container">
     <slot name="message" />
    </div>
  </div>

`;


class PopupNotify extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    // Attach template to shadow root
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  tooltip(expandState){
    const tooltip= this.shadowRoot.querySelector('.notify-container')
    const alert= this.shadowRoot.querySelector('.alert')
    const cancel= this.shadowRoot.querySelector('.cancel')

    if(expandState == true){
      tooltip.style.transform = 'scale(1)'
      alert.style.display = 'none'
      cancel.style.display = 'block'
      expandState = false;
    }else{
      tooltip.style.transform = 'scale(0)'
      alert.style.display = 'block'
      cancel.style.display = 'none'
      expandState = true;
    }
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.alert').addEventListener('click', ()=> {
      this.tooltip(true)
    })
    this.shadowRoot.querySelector('.cancel').addEventListener('click', ()=> {
      this.tooltip(false)
    })
  }
}



window.customElements.define('popup-notify', PopupNotify)