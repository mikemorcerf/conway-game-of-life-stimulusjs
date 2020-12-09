import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["playButton"]

  connect() {
    this.gameStarted = false
  }

  startGame(event) {
    event.preventDefault();

    if (this.gameStarted) {
      this.gameStarted = false
      this.playButtonTarget.classList.remove('timer--on')
    } else {
      this.gameStarted = true
      this.playButtonTarget.classList.add('timer--on')
    }
  }
}
