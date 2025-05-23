import { Game as PhaserGame } from 'phaser'

import { GameState } from '@/classes/game-state'
import { nullNumber } from '@/types/main-types'
import { ScopeActions } from '@/types/enums'

export class ScopeEndGame {
  _state: GameState
  _phaser: PhaserGame
  _gameScope: number = 0
  _startTime: nullNumber = null

  constructor(phaser: PhaserGame, state: GameState) {
    this._state = state
    this._phaser = phaser
  }

  startGame() {
    this._state.isGameStarted = true
    this.resume()
    this._startTime = Date.now()
  }

  getGameTime() {
    if (!this._startTime) return 0
    return this._startTime - Date.now()
  }

  endGame() {
    this._state.isGameStarted = false
    this._startTime = null
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

  setIsShowIntro(flag: boolean) {
    this._state.isShowGameIntro = flag
  }

  addScope(actions: ScopeActions, coutn?: number) {
    switch (actions) {
      case ScopeActions.difficultLevel:
        const levels = { 0: 0, 1: 5, 2: 15, 3: 50 }
        const level = this._state.selectedMap?.difficult
        this._gameScope += level ? levels[level] : 0
        break
      case ScopeActions.onTimes:
        const oneMinute = 60000
        const maxTime = 10 * oneMinute
        const restTime = maxTime - this.getGameTime()
        console.log('times', this.getGameTime(), 'rest time', restTime, Math.ceil(restTime / oneMinute))
        this._gameScope += restTime > 0 ? Math.ceil(restTime / oneMinute) * 3 : 0
        break
      case ScopeActions.searchBox:
        this._gameScope += 10
    }
  }
}
