import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["gameBoard", "playButton", "timerContainer", "timerText"]

  connect() {
    this.gameStarted = false
    this.boardSize = 20
    this.liveCells = {}
    this.cellsToBeProcessed = []

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
  }

  get timerText() {
    const time = this.timerContainerTarget.value
    if (time > 1) {
      return "<p>seconds</p><p>per cycle</p>"
    } else {
      return "<p>second</p><p>per cycle</p>"
    }
  }

  updateCell(event) {
    event.preventDefault()

    if (!this.gameStarted) {
      const cellID = event.target.id
      const cellXcoordinate = cellID % this.boardSize
      var cellYcoordinate = 0
      if (cellID>0){
        cellYcoordinate = parseInt(cellID / this.boardSize)
      }
  
      if (this.liveCells.hasOwnProperty(cellID)){
        delete this.liveCells[cellID]
      } else {
        var newCell = {
          id: cellID,
          xCoord: cellXcoordinate,
          yCoord: cellYcoordinate,
          alive: true,
          numOfNeighbors: 0,
        }
        this.liveCells[cellID] = newCell
      }
  
      this.renderBoard()
    }
  }

  renderBoard() {
    const board = this.gameBoardTarget
    board.innerHTML = ""

    let cells = ""
    let cellID = 0

    for(let row=0; row < this.boardSize; row++) {
      for(let col=0; col < this.boardSize; col++) {
        if (this.liveCells[cellID]) {
          cells += `<div data-action="click->game#updateCell" class="board-cell cell-alive" id="${cellID}"></div>`
        } else {
          cells += `<div data-action="click->game#updateCell" class="board-cell" id="${cellID}"></div>`
        }
        cellID++
      }
    }

    board.innerHTML = cells
  }
}
