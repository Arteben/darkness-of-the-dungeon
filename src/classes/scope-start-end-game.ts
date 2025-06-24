import { Game as PhaserGame } from 'phaser'

import dateFormater from 'dateformat'

import { GameState } from '@/classes/game-state'
import { DungeonDarkness } from '@/classes/dungeon-darkness'
import { NotificationsModalsSystem as ModalsSystem } from '@/classes/notifications-modals-system'
import { SoundSystem } from '@/classes/sound-system'

import {
  nullNumber,
  IUserModalAddOptions,
  IParamsForInitEngine,
} from '@/types/main-types'
import {
  ScopeActions,
  GamePages,
  FonMusicTypes,
  UserModalAddOptionsEnum,
} from '@/types/enums'

import warriorModalEnd from '@assets/warrior-modal-end.png'
import warriorImg from '@assets/warrior-modal.png'

export class ScopeStartEndGame {
  _state: GameState
  _phaser: PhaserGame
  _modalSystem: ModalsSystem
  _soundSystem: SoundSystem
  gameScope: number = 0
  _startTime: nullNumber = null

  restart: VoidFunction
  startMainEngine: VoidFunction

  constructor(phaser: PhaserGame, dungeonDarkness: DungeonDarkness, soundSystem: SoundSystem) {
    this._state = dungeonDarkness.state
    this._phaser = phaser
    this._modalSystem = dungeonDarkness.modalsSystem
    this._soundSystem = soundSystem

    this.startMainEngine = () => {
      const map = dungeonDarkness.getSelectedMap()
      if (!this._phaser || !map) return

      const initParams: IParamsForInitEngine = {
        nameMap: map.name,
        slotsSystem: dungeonDarkness.slotsSystem,
        modalsSystem: this._modalSystem,
        scopeEndGame: this,
        soundSystem: this._soundSystem,
      }
      this._phaser.scene.start(dungeonDarkness.mainSceneName, initParams)
      this.pause()
    }

    this.restart = () => {
      if (!this._phaser) return
      dungeonDarkness.slotsSystem.cleanAllSlots()
      this.setMusic(FonMusicTypes.none)
      this._phaser.scene.stop(dungeonDarkness.mainSceneName)
      this.endGame()
      this.toMainMenu()
      this.startMainEngine()
    }
  }

  startGame() {
    this._state.isGameStarted = true
    this.setTransparent(false)
    this._startTime = Date.now()
    this.setMusic(FonMusicTypes.fon)
    this.resume()
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

  setMusic(type: FonMusicTypes) {
    this._soundSystem.setFonMusic(type)
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

  showStartGameUserModal() {
    this.setMusic(FonMusicTypes.intro)
    this._modalSystem.showModal({
      text: this._modalSystem.loc('gameIntroModalText'),
      callback: (options?: IUserModalAddOptions[]) => {
        this.startGame()
        if (!options) return
        options.forEach((element: IUserModalAddOptions) => {
          if (UserModalAddOptionsEnum[element.prop] == 'shownOnStart') {
            this.setIsShowIntro(element.value)
          }
        })
      },
      image: warriorImg,
      options: [{
        value: true,
        prop: UserModalAddOptionsEnum.shownOnStart,
      }],
    })
  }

  showEndGameUserModal() {
    this.addScope(ScopeActions.difficultLevel)
    this.addScope(ScopeActions.onTimes)

    this.setMusic(FonMusicTypes.endMusic)

    const gameTime = new Date(this.getGameTime())
    const userModals = this._modalSystem

    userModals.showModal({
      text: userModals.loc('gameEndModalText'),
      callback: () => { this.restart() },
      image: warriorModalEnd,
      titles: [{
        title: ' ' + userModals.loc('gameEndModalTitleScope'),
        value: String(this.gameScope),
        bigValue: true,
      }, {
        title: userModals.loc('gameEndModalTitleTime'),
        value: ' ' + dateFormater(gameTime, 'MM:ss')
      }],
    })
  }
}
