import { Controller } from "stimulus"
import RandExp from "randexp"

export default class extends Controller {
  static targets = ["gameBoard", "dataButton", "playButton", "timerContainer", "timerText"]

  connect() {
    this.gameStarted = false
    this.boardSize = 20
    this.liveCells = {}
    this.deadCellsToBeProcessed = {}
    this.cellsForNextGeneration = {}

    this.renderBoard()
  }

  startGame(event) {
    event.preventDefault()

    if (this.gameStarted) {
      this.gameStarted = false
      this.playButtonTarget.textContent="▶︎"
      this.playButtonTarget.classList.remove('timer--on')
      this.dataButtonTargets.forEach(dataButton => {
        dataButton.classList.remove('timer--on')
      })
      this.timerContainerTarget.classList.remove('timer--on')
      this.timerContainerTarget.readOnly = false;
      this.stopRefreshing()
    } else {
      this.gameStarted = true
      this.playButtonTarget.textContent="◼"
      this.playButtonTarget.classList.add('timer--on')
      this.dataButtonTargets.forEach(dataButton => {
        dataButton.classList.add('timer--on')
      })
      this.timerContainerTarget.classList.add('timer--on')
      this.timerContainerTarget.readOnly = true;
      this.startRefreshing()
    }
  }

  startRefreshing() {
    this.refreshTimer = setInterval(() => {
      this.processLiveCells()
    }, (this.timerContainerTarget.value * 1000))
  }

  stopRefreshing() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
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

  generateRandomData(event) {
    event.preventDefault()

    this.deleteAllLiveCells()

  }

  deleteAllData(event) {
    event.preventDefault()

    this.deleteAllLiveCells()
    this.renderBoard()
  }

  updateCell(event) {
    event.preventDefault()

    if (!this.gameStarted) {
      const cellID = event.target.id
      const cellXcoordinate = this.getCellXCoordinateFromCellId({ cellID })
      var cellYcoordinate = 0
      if (cellID>0){
        cellYcoordinate = this.getCellYCoordinateFromCellId({ cellID })
      }
  
      if (this.liveCells.hasOwnProperty(cellID)){
        delete this.liveCells[cellID]
      } else {
        var newCell = this.createNewCell({
          cellID,
          cellXcoordinate,
          cellYcoordinate,
          alive: true,
        })
        this.liveCells[cellID] = newCell
      }
  
      this.renderBoard()
    }
  }

  processLiveCells() {
    this.deadCellsToBeProcessed = {}

    for (var liveCell in this.liveCells) {
      this.liveCells[liveCell].numOfNeighbors = 0
      const startingXcoord = (this.liveCells[liveCell].xCoord - 1)
      const startingYcoord = (this.liveCells[liveCell].yCoord - 1)
      
      for(let row=startingXcoord; row <= startingXcoord+2; row++) {
        for(let col=startingYcoord; col <= startingYcoord+2; col++) {
          if((row<0) ||
            (row>=this.boardSize) ||
            (col<0) ||
            (col>=this.boardSize)||
            (row==startingXcoord+1)&&(col==startingYcoord+1)){
            continue
          } else {
            const cellID = this.getCellIdFromCoordinates({coordX:row, coordY:col})
            if(this.liveCells[cellID]){
              this.liveCells[liveCell].numOfNeighbors++
            } else {
              if(!this.deadCellsToBeProcessed[cellID]){
                var newCell = this.createNewCell({
                  cellID,
                  cellXcoordinate: row,
                  cellYcoordinate: col,
                  alive: false,
                  numOfNeighbors: 1
                })
                this.deadCellsToBeProcessed[cellID] = newCell
              } else {
                this.deadCellsToBeProcessed[cellID].numOfNeighbors++
              }
            }
          }
        }
      }
      const numOfNeighbors = this.liveCells[liveCell].numOfNeighbors
      if(numOfNeighbors==2 || numOfNeighbors==3) {
        this.cellsForNextGeneration[liveCell] = this.liveCells[liveCell]
      }
    }

    for (var deadCell in this.deadCellsToBeProcessed) {
      const numOfNeighbors = this.deadCellsToBeProcessed[deadCell].numOfNeighbors
      if(numOfNeighbors==3) {
        this.deadCellsToBeProcessed[deadCell].alive = true
        this.cellsForNextGeneration[deadCell] = this.deadCellsToBeProcessed[deadCell]
      }
    }

    this.liveCells = this.cellsForNextGeneration
    this.cellsForNextGeneration = {}

    this.renderBoard()
  }

  renderBoard() {
    const board = this.gameBoardTarget
    board.innerHTML = ""

    let cells = ""
    let cellID = 0

    for(let row=0; row < this.boardSize; row++) {
      for(let col=0; col < this.boardSize; col++) {
        if (this.liveCells[cellID]) {
          cells += `<div data-action="click->game#updateCell" class="board-cell cell-alive" id="${cellID}" style="background:${this.liveCells[cellID].color}"></div>`
        } else {
          cells += `<div data-action="click->game#updateCell" class="board-cell" id="${cellID}"></div>`
        }
        cellID++
      }
    }

    board.innerHTML = cells
  }

  hexaColorGenerator(){
    let color = '#'
    color += new RandExp(/([a-f0-9]{6})/).gen();
    return color
  }

  createNewCell({ cellID,
                  cellXcoordinate,
                  cellYcoordinate,
                  alive,
                  numOfNeighbors,
                  cellColor}){
    return {
      id: cellID,
      xCoord: cellXcoordinate,
      yCoord: cellYcoordinate,
      alive: alive,
      numOfNeighbors: numOfNeighbors? numOfNeighbors : 0,
      color: cellColor? cellColor : this.hexaColorGenerator()
    }
  }

  deleteAllLiveCells(){
    this.liveCells = {}
  }

  getCellIdFromCoordinates({coordX, coordY}) {
    return (((coordX+1) + (coordY*this.boardSize)) - 1)
  }

  getCellXCoordinateFromCellId({cellID}){
    return cellID % this.boardSize
  }

  getCellYCoordinateFromCellId({cellID}){
    return parseInt(cellID / this.boardSize)
  }
}
