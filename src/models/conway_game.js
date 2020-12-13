import RandExp from "randexp"

export default class ConwayGame {
  constructor({ boardSize }) {
    this.liveCells = {}
    this.cellsToBeConsidered = {}
    this.cellsForNextGeneration = {}
    this.boardSize = boardSize
  }

  flipCell({ xCoord, yCoord }) {
    if (this.hasLiveCell({ xCoord, yCoord })){
      this.deleteLiveCell({ xCoord, yCoord })
    } else {
      this.createLiveCell({ xCoord, yCoord })
    }
  }

  processLiveCells() {
    this.deadCellsToBeProcessed = {}

    for (let liveCell in this.liveCells) {
      this.cellsToBeConsidered[liveCell] = {xCoord: this.liveCells[liveCell].xCoord, yCoord: this.liveCells[liveCell].yCoord}
      const neighboringCellCoordinates = this.getNeighboringCellCoordinates({xCoord: this.liveCells[liveCell].xCoord, yCoord: this.liveCells[liveCell].yCoord})

      neighboringCellCoordinates.forEach(cell => {
        const cellId = this.getCellId({xCoord: cell.xCoord, yCoord: cell.yCoord})
        this.cellsToBeConsidered[cellId] = {xCoord: cell.xCoord, yCoord: cell.yCoord}
      })

      for (let cell in this.cellsToBeConsidered){
        
      }
    }
  }

  returnNewCell({ xCoord,
                  yCoord,
                  alive,
                  numOfNeighbors,
                  cellColor }){
    const cellId = this.getCellId({ xCoord, yCoord })
    return {
      id: cellId,
      alive: alive,
      xCoord,
      yCoord,
      numOfNeighbors: numOfNeighbors ? numOfNeighbors : 0,
      color: cellColor ? cellColor : this.hexaColorGenerator()
    }
  }

  createLiveCell({  xCoord,
    yCoord,
    numOfNeighbors,
    cellColor}){
      const newLiveCell = this.returnNewCell({
        xCoord,
        yCoord,
        alive: true,
        numOfNeighbors,
        cellColor
      })
      
      this.liveCells[newLiveCell.id] = newLiveCell
    }
    
    createRandomLiveCell() {
      let randomXCoord = this.getRandomInt({ maxNotInclusive: this.boardSize })
      let randomYCoord = this.getRandomInt({ maxNotInclusive: this.boardSize })
      while (this.hasLiveCell({ xCoord: randomXCoord, yCoord: randomYCoord})){
        randomXCoord = this.getRandomInt({ maxNotInclusive: this.boardSize })
        randomYCoord = this.getRandomInt({ maxNotInclusive: this.boardSize })
      }
      this.createLiveCell({ xCoord: randomXCoord, yCoord: randomYCoord})
    }

    createLiveCellsFromArray({cellsArray, cellColor}){
      cellsArray.forEach(cell => {
      this.createLiveCell({ xCoord: cell.xCoord, yCoord: cell.yCoord, cellColor })
    })
  }

  deleteLiveCell({ xCoord, yCoord }) {
    const cellId = this.getCellId({ xCoord, yCoord })
    delete this.liveCells[cellId]
  }
  
  deleteAllLiveCells(){
    if(Object.keys(this.liveCells).length > 0) {
      this.liveCells = {}
    }
  }

  deleteLiveCellsFromArray({cellsArray}){
    cellsArray.forEach(cell => {
      this.deleteLiveCell({ xCoord: cell.xCoord, yCoord: cell.yCoord })
    })
  }
  
  getCellId({ xCoord, yCoord }) {
    return `x${xCoord},y${yCoord}`
  }

  getCellCoordinatesFromId({ cellId }){
    const xCoordRegex = /(?<=x)(\d+)(?=,)/
    const yCoordRegex = /(?<=y)(\d+)$/

    const xCoord = cellId.match(xCoordRegex)[0]
    const yCoord = cellId.match(yCoordRegex)[0]

    return {xCoord, yCoord}
  }

  getCellColor({ xCoord, yCoord }){
    const cellId = this.getCellId({ xCoord, yCoord })
    return this.liveCells[cellId].color
  }

  getNumberOfLiveCells(){
    return Object.keys(this.liveCells).length
  }

  getNeighboringCellCoordinates({ xCoord, yCoord }){
    return ([
      { xCoord: parseInt(xCoord)-1, yCoord: parseInt(yCoord)+1},
      { xCoord: parseInt(xCoord), yCoord: parseInt(yCoord)+1},
      { xCoord: parseInt(xCoord)+1, yCoord: parseInt(yCoord)+1},
      { xCoord: parseInt(xCoord)-1, yCoord: parseInt(yCoord)},
      { xCoord: parseInt(xCoord)+1, yCoord: parseInt(yCoord)},
      { xCoord: parseInt(xCoord)-1, yCoord: parseInt(yCoord)-1},
      { xCoord: parseInt(xCoord), yCoord: parseInt(yCoord)-1},
      { xCoord: parseInt(xCoord)+1, yCoord: parseInt(yCoord)-1}
    ])
  }

  hasLiveCell({ xCoord, yCoord }) {
    const cellId = this.getCellId({xCoord, yCoord})
    return this.liveCells.hasOwnProperty(cellId)
  }

  hexaColorGenerator(){
    let color = '#'
    color += new RandExp(/([a-f0-9]{6})/).gen();
    return color
  }

  getRandomInt({ maxNotInclusive }) {
    return Math.floor(Math.random() * Math.floor(maxNotInclusive));
  }
}