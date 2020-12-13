export default class BoardRenderer {
  constructor({ boardSize }) {
    this.boardSize = boardSize
  }

  getConwayBoardHtml({ conwayGame }) {
    let cells = ""

    for(let row=0; row < this.boardSize; row++) {
      for(let col=0; col < this.boardSize; col++) {
        if (conwayGame.hasLiveCell({ xCoord: col, yCoord: row })) {
          cells += `<div data-action="click->game#updateCell" class="board-cell cell-alive" id="x${col},y${row}" style="background:${conwayGame.getCellColor({ xCoord: col, yCoord: row })}"></div>`
        } else {
          cells += `<div data-action="click->game#updateCell" class="board-cell" id="x${col},y${row}"></div>`
        }
      }
    }

    return cells
  }
}