import { Game as PhaserGame } from 'phaser'

import { GameState } from '@/classes/game-state'
import { DungeonDarkness } from '@/classes/dungeon-darkness'
import { nullNumber } from '@/types/main-types'
import {
  ScopeActions,
  GamePages,
  FonMusicTypes,
} from '@/types/enums'

export class ScopeStartEndGame {
  _state: GameState
  _phaser: PhaserGame
  gameScope: number = 0
  _startTime: nullNumber = null

  restartTheGame: VoidFunction
  setMusic: (a: FonMusicTypes) => void

  constructor(phaser: PhaserGame, state: GameState, dungeonDarkness: DungeonDarkness) {
    this._state = state
    this._phaser = phaser
    this.restartTheGame = () => {
      this.setMusic(FonMusicTypes.none)
      this.toMainMenu()
      dungeonDarkness.restartMainEngine()
    }

    this.setMusic = (type: FonMusicTypes) => {
      dungeonDarkness.soundSystem?.setFonMusic(type)
    }
  }

  startGame() {
    this._state.isGameStarted = true
    this.setTransparent(false)
    this.resume()
    this._startTime = Date.now()
    this.setMusic(FonMusicTypes.fon)
  }

  getGameTime() {
    if (!this._startTime) return 0
    return Date.now() - this._startTime
  }

  endGame() {
    this._state.isGameStarted = false
    this._startTime = null
    this.gameScope = 0
    this.setTransparent(true)
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
    return this._state.isShowGameIntro
  }

  setIsShowIntro(flag: boolean) {
    this._state.isShowGameIntro = flag
  }

  addScope(actions: ScopeActions, coutn?: number) {
    switch (actions) {
      case ScopeActions.difficultLevel:
        const levels = { 0: 0, 1: 5, 2: 15, 3: 50 }
        const level = this._state.selectedMap?.difficult
        this.gameScope += level ? levels[level] : 0
        break
      case ScopeActions.onTimes:
        const oneMinute = 60000
        const maxTime = 10 * oneMinute
        const restTime = maxTime - this.getGameTime()
        this.gameScope += restTime > 0 ? Math.floor(restTime / oneMinute) * 1 : 0
        break
      case ScopeActions.searchBox:
        this.gameScope += 3
    }
  }

  setTransparent(flag: boolean) {
    if (!this._phaser || !this._phaser.canvas) return
    this._phaser.canvas.style.opacity = flag ? '0' : '1'
  }

  toMainMenu() {
    this._state.page = GamePages.mainMenu
  }
}
