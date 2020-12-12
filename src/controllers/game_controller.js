/*
  Author: Michael de Morcerf e Moura
  LinkedIn: https://www.linkedin.com/in/michaelmoura/
  Github: https://github.com/mikemorcerf
  Date: 12/11/2020
*/

import { Controller } from "stimulus"
import RandExp from "randexp"

export default class extends Controller {
  static targets = ["gameBoard", "dataButton", "playButton", "timerContainer", "timerText"]

  connect() {
    this.boardSize = 20
    this.totalNumberOfCells = this.boardSize * this.boardSize
    this.liveCells = {}
    this.deadCellsToBeProcessed = {}
    this.cellsForNextGeneration = {}
    this.animationIntervalInMilliseconds = 25
    this.creationIntervalInMilliseconds = 1
    this.numberOfRandomCells = 100
    //this.animationCreationSupportArray = []

    this.renderBoard()
  }

  startGame(event) {
    if(event) {
      event.preventDefault()
    }

    if (this.allowToContinue()) {
      this.playButtonTarget.textContent="◼"
      this.playButtonTarget.classList.add('timer--on')
      this.dataButtonTargets.forEach(dataButton => {
        dataButton.classList.add('timer--on')
      })
      this.timerContainerTarget.classList.add('timer--on')
      this.timerContainerTarget.readOnly = true;
      this.startRefreshing()
    } else {
      this.playButtonTarget.textContent="▶︎"
      this.playButtonTarget.classList.remove('timer--on')
      this.dataButtonTargets.forEach(dataButton => {
        dataButton.classList.remove('timer--on')
      })
      this.timerContainerTarget.classList.remove('timer--on')
      this.timerContainerTarget.readOnly = false;
      this.stopRefreshing()
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
      delete this.refreshTimer
    }
  }

  updateSpeed(event) {
    if(event) {
      event.preventDefault()
    }

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
    if(event) {
      event.preventDefault()
    }

    if (this.allowToContinue()) {
      const cellId = event.target.id

      if (this.liveCells.hasOwnProperty(cellId)){
        delete this.liveCells[cellId]
      } else {
        const newCell = this.returnNewCell({
          cellId,
          alive: true,
        })
        this.liveCells[cellId] = newCell
      }
      this.renderBoard()
    }
  }

  processLiveCells() {
    this.deadCellsToBeProcessed = {}

    for (let liveCell in this.liveCells) {
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
            const cellId = this.getcellIdFromCoordinates({coordX:row, coordY:col})
            if(this.liveCells[cellId]){
              this.liveCells[liveCell].numOfNeighbors++
            } else {
              if(!this.deadCellsToBeProcessed[cellId]){
                const newCell = this.returnNewCell({
                  cellId,
                  cellXcoordinate: row,
                  cellYcoordinate: col,
                  alive: false,
                  numOfNeighbors: 1
                })
                this.deadCellsToBeProcessed[cellId] = newCell
              } else {
                this.deadCellsToBeProcessed[cellId].numOfNeighbors++
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

    for (let deadCell in this.deadCellsToBeProcessed) {
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
    let cellId = 0

    for(let row=0; row < this.boardSize; row++) {
      for(let col=0; col < this.boardSize; col++) {
        if (this.liveCells[cellId]) {
          cells += `<div data-action="click->game#updateCell" class="board-cell cell-alive" id="${cellId}" style="background:${this.liveCells[cellId].color}"></div>`
        } else {
          cells += `<div data-action="click->game#updateCell" class="board-cell" id="${cellId}"></div>`
        }
        cellId++
      }
    }

    board.innerHTML = cells
  }

  hexaColorGenerator(){
    let color = '#'
    color += new RandExp(/([a-f0-9]{6})/).gen();
    return color
  }

  returnNewCell({ cellId,
                  cellXcoordinate,
                  cellYcoordinate,
                  alive,
                  numOfNeighbors,
                  cellColor}){
    return {
      id: cellId,
      alive: alive,
      xCoord: cellXcoordinate ? cellXcoordinate : this.getCellXCoordinateFromcellId({ cellId }),
      yCoord: cellYcoordinate ? cellYcoordinate : this.getCellYCoordinateFromcellId({ cellId }),
      numOfNeighbors: numOfNeighbors ? numOfNeighbors : 0,
      color: cellColor ? cellColor : this.hexaColorGenerator()
    }
  }

  deleteAllLiveCells(){
    this.liveCells = {}
  }

  getcellIdFromCoordinates({coordX, coordY}) {
    return (((coordX+1) + (coordY*this.boardSize)) - 1)
  }

  getCellXCoordinateFromcellId({cellId}){
    return cellId % this.boardSize
  }

  getCellYCoordinateFromcellId({cellId}){
    if (cellId==0){
      return 0
    } else {
      return parseInt(cellId / this.boardSize)
    }
  }

  createLiveCellsFromArray({cellIdsArray, cellColor}){
    cellIdsArray.forEach(cellId => {
      this.liveCells[cellId] = this.returnNewCell({cellId, alive: true, cellColor})
    })
  }

  deleteLiveCellsFromArray({cellIdsArray}){
    cellIdsArray.forEach(cellId => {
      delete this.liveCells[cellId]
    })
  }

  allowToContinue(){
    return( !this.refreshTimer &&
        !this.cellCreationTimer &&
        !this.creationAnimationTimer &&
        !this.destructionAnimationTimer )
  }

  generateRandomData(event) {
    if(event) {
      event.preventDefault()
    }

    if (this.allowToContinue()) {
      if(Object.keys(this.liveCells).length > 0) {
        this.deleteAllLiveCells()
      }
  
      this.cellCreationTimer = setInterval(() => {
        let randomCellId = Math.floor(Math.random() * Math.floor(this.totalNumberOfCells))
        while(this.liveCells.hasOwnProperty(randomCellId)){
          randomCellId = Math.floor(Math.random() * Math.floor(this.totalNumberOfCells))
        }
  
        const newCell = this.returnNewCell({
          cellId: randomCellId,
          alive: true,
        })
        this.liveCells[randomCellId] = newCell
        this.renderBoard()
  
        if(Object.keys(this.liveCells).length >= this.numberOfRandomCells){
          if (this.cellCreationTimer) {
            clearInterval(this.cellCreationTimer)
            delete this.cellCreationTimer
          }
        }
      }, this.creationIntervalInMilliseconds)
    }
  }

  deleteAllLiveCellsWithExplosionAnimation(event) {
    if(event) {
      event.preventDefault()
    }

    if (this.allowToContinue()) {
      const explosionAnimationArray = [
        [189, 190, 209, 210],
        [168, 169, 170, 171, 187, 188, 191, 192, 207, 208, 211, 212, 228, 229, 230, 231],
        [147, 148, 149, 150, 151, 152, 166, 167, 172, 173, 186, 193, 206, 213, 226, 227, 232, 233, 247, 248, 249, 250, 251, 252],
        [126, 127, 128, 129, 130, 131, 132, 133, 145, 146, 153, 154, 165, 174, 185, 194, 205, 214, 225, 234, 245, 246, 253, 254, 266, 267, 268, 269, 270, 271, 272, 273],
        [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 124, 125, 134, 135, 144, 155, 164, 175, 184, 195, 204, 215, 224, 235, 244, 255, 264, 265, 274, 275, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294],
        [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 103, 104, 115, 116, 123, 136, 143, 156, 163, 176, 183, 196, 203, 216, 223, 236, 243, 256, 263, 276, 283, 284, 295, 296, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315],
        [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 82, 83, 96, 97, 102, 117, 122, 137, 142, 157, 162, 177, 182, 197, 202, 217, 222, 237, 242, 257, 262, 277, 282, 297, 302, 303, 316, 317, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336],
        [42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 61, 62, 77, 78, 81, 98, 101, 118, 121, 138, 141, 158, 161, 178, 181, 198, 201, 218, 221, 238, 241, 258, 261, 278, 281, 298, 301, 318, 321, 322, 337, 338, 342, 343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357],
        [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 40, 41, 58, 59, 60, 79, 80, 99, 100, 119, 120, 139, 140, 159, 160, 179, 180, 199, 200, 219, 220, 239, 240, 259, 260, 279, 280, 299, 300, 319, 320, 339, 340, 341, 358, 359, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378],
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 39, 360, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397, 398, 399]
      ]
  
      const explosionColorArray = [
        "#fc9d03",
        "#fc8403",
        "#fc7303",
        "#fc6203",
        "#fc5603",
        "#fc4103",
        "#fc2c03",
        "#fc0303",
        "#fa3e3e",
        "#ff5454"
      ]
  
      let arrayIndex = 0
      let arraySize = explosionAnimationArray.length
  
      this.creationAnimationTimer = setInterval(() => {
  
        this.createLiveCellsFromArray({
          cellIdsArray: explosionAnimationArray[arrayIndex],
          cellColor: explosionColorArray[arrayIndex]
        })
        this.renderBoard()
        arrayIndex++
  
        if(arrayIndex>=arraySize){
          if (this.creationAnimationTimer) {
            clearInterval(this.creationAnimationTimer)
            delete this.creationAnimationTimer
            arrayIndex = 0
  
            this.destructionAnimationTimer = setInterval(() => {
  
              this.deleteLiveCellsFromArray({
                cellIdsArray: explosionAnimationArray[arrayIndex],
              })
              this.renderBoard()
              arrayIndex++
  
              if(arrayIndex>=arraySize){
                if (this.destructionAnimationTimer) {
                  clearInterval(this.destructionAnimationTimer)
                  delete this.destructionAnimationTimer
                }
              }
  
            }, this.animationIntervalInMilliseconds)
          }
        }
      }, this.animationIntervalInMilliseconds)
    }
  }

  printCopyToClipboardAndEraseAnimationCreationSupportArray(){
    console.log(this.animationCreationSupportArray)
    let animationArraySizeMinusOne = this.animationCreationSupportArray.length - 1
    let animationArrayString = "["

    this.animationCreationSupportArray.forEach((cellId, index) => {
      animationArrayString += `${cellId}`
      if(index<animationArraySizeMinusOne){
        animationArrayString += ", "
      }
    })

    animationArrayString += "]"

    navigator.clipboard.writeText(animationArrayString)
    this.animationCreationSupportArray = []
  }
}
