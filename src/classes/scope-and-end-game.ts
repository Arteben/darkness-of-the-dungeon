import { Game as PhaserGame } from 'phaser'

import { GameState } from '@/classes/game-state'

export class ScopeEndGame {
  _state: GameState
  _phaser: PhaserGame

  _gemeScope: number = 0

  constructor(phaser: PhaserGame, state: GameState) {
    this._state = state
    this._phaser = phaser
  }

  startGame() {
    this._state.isGameStarted = true
    this.resume()
  }

  endGame() {
    this._state.isGameStarted = false
    this.pause()
  }

  pause() {
    if (!this._phaser.isPaused) {
      this._phaser.pause()
    }
  }

  resume() {
    if (this._phaser.isPaused && this._state.isGameStarted) {
      this._phaser.resume()
    }
  }

  isShowIntro() {
    return this._state.isShowGameIntro && !this._state.isGameStarted
  }

  setIsShowIntro (flag: boolean) {
    this._state.isShowGameIntro = flag
  }
}
