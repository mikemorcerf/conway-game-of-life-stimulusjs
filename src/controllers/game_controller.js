import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["gameBoard", "playButton", "timerContainer", "timerText"]

  connect() {
    this.gameStarted = false

    this.renderBoard()
  }

  startGame(event) {
    event.preventDefault()

    if (this.gameStarted) {
      this.gameStarted = false
      this.playButtonTarget.classList.remove('timer--on')
      this.timerContainerTarget.classList.remove('timer--on')
    } else {
      this.gameStarted = true
      this.playButtonTarget.classList.add('timer--on')
      this.timerContainerTarget.classList.add('timer--on')
    }
  }

  updateSpeed(event) {
    event.preventDefault()

    this.timerTextTarget.innerHTML = this.timerText

    const timeInput = this.timerContainerTarget.value
    if (timeInput <= 0) {
      this.timerContainerTarget.value = 0.1
    }

    console.log('hello')
  }

  get timerText() {
    const time = this.timerContainerTarget.value
    if (time > 1) {
      return "<p>seconds</p><p>per cycle</p>"
    } else {
      return "<p>second</p><p>per cycle</p>"
    }
  }

  renderBoard() {
    const boardSize = 20
    const board = this.gameBoardTarget
    board.innerHTML = ""

    let cells = ""

    for(let row=0; row<boardSize; row++) {
      for(let col=0; col<boardSize; col++) {
        cells += '<div class="board-cell"></div>'
      }
    }

    board.innerHTML = cells
  }
}
