import {
  GamePages,
  GameStateSettings,
  UserModalAddOptionsEnum,
} from '@/types/enums'

import {
  IJsonMap,
  IResolution,
  GameStateChangeData,
  IParamsForInitEngine,
  INotificationAnimTimeouts,
  IUserModalAddOptions,
} from '@/types/main-types'

import { WEBGL, Types, Game as PhaserGame } from 'phaser'

import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'

import '@/game-app'
import { GameApp } from '@/game-app'

import warriorImg from '@assets/warrior-modal.png'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

import { MainEngine } from '@/classes/main-engine'
import { PocketSlotsSystem } from '@/classes/pocket-slots-system'
import { NotificationsModalsSystem as ModalsSystem } from '@/classes/notifications-modals-system'
import { ScopeEndGame } from '@/classes/scope-and-end-game'

export let dungeonDarknessGame: DungeonDarkness | null = null

export const getDungeonDarknessGame = () => {
  return dungeonDarknessGame
}

export class DungeonDarkness {
  state: GameState
  locals: Translates

  _phConfig: Types.Core.GameConfig = {
    width: 800,
    height: 384,
    // canvas: HTMLCanvasElement,
    // parent,
    scene: [],
    type: WEBGL,
    backgroundColor: '06050d',
    // backgroundColor: '#1b262c',
    pixelArt: true,
    antialias: false,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 300 },
        debug: false,
      }
    },
    fps: {
      target: 60,
      forceSetTimeOut: true,
    },
  }

  phaser?: PhaserGame
  gameApp?: GameApp

  _mainSceneName: string = 'MainEngine'

  _slotsSystem: PocketSlotsSystem
  maxSlots: number

  _modalsSystem: ModalsSystem
  // time in seconds
  notificationAnimTimeouts: INotificationAnimTimeouts = {
    start: 0.2,
    break: 0.5,
    hold: 10,
  }

  _scopeEndGame?: ScopeEndGame

  constructor(state: GameState, locals: Translates) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    dungeonDarknessGame = this
    this.state = state
    this.locals = locals

    this._slotsSystem = new PocketSlotsSystem(state)
    this.maxSlots = this._slotsSystem.maxSlotsNum

    this._modalsSystem = new ModalsSystem(
      state, this.notificationAnimTimeouts, this.locals)

    // select any map if map not selected!
    if (!this.getSelectedMap()) {
      const mapList = JsonMapList as IJsonMap[]

      if (mapList.length == 0) {
        console.error('MAPS arent unviable')
        return
      }

      this.state.selectedMap = {
        type: mapList[0].name,
        difficult: mapList[0].level,
      }
    }

    EventBus.subscribeStateChanges(this.onChangeGameState, this)
    window.addEventListener('resize', (event: UIEvent) => { this.onWindowResize() })
  }

  startMainEngine() {
    const map = this.getSelectedMap()
    if (!this.phaser || !this._scopeEndGame || !map) return

    const initParams: IParamsForInitEngine = {
      nameMap: map.name,
      slotsSystem: this._slotsSystem,
      modalsSystem: this._modalsSystem,
      scopeEndGame: this._scopeEndGame
    }
    this.phaser.scene.start(this._mainSceneName, initParams)
    this._scopeEndGame.pause()
  }

  createPhaserGame(canvas: HTMLCanvasElement, parentApp: HTMLElement, appElement: GameApp) {
    this.gameApp = appElement
    this._phConfig.parent = parentApp
    this._phConfig.canvas = canvas
    this.phaser = new PhaserGame(this._phConfig)
    this._scopeEndGame = new ScopeEndGame(this.phaser, this.state, this)
    this._scopeEndGame.setTransparent(true)
    this.phaser.scene.add(this._mainSceneName, MainEngine, false)
    this.startMainEngine()
  }

  getSelectedMap(): IJsonMap | null {
    const mapList = JsonMapList as IJsonMap[]
    const selectedMap = this.state.selectedMap

    if (!selectedMap)
      return null

    const findedMapIndex = mapList.findIndex((el) => el.name == selectedMap.type)
    if (findedMapIndex == -1)
      return null

    return mapList[findedMapIndex]
  }

  private onChangeGameState(data: CustomEventInit) {
    const eventDetail = data.detail as GameStateChangeData
    if (!this._scopeEndGame) return
    const scopeEndGame = this._scopeEndGame

    if (eventDetail.property == GameStateSettings.pages) {
      if (this.state.page == GamePages.game) {
        if (this.state.isGameStarted) {
          scopeEndGame.resume()
        } else if (scopeEndGame.isShowIntro()) {
          this._modalsSystem.showModal({
            text: this._modalsSystem.loc('gameIntroModalText'),
            callback: (options?: IUserModalAddOptions[]) => {
              scopeEndGame.startGame()
              if (!options) return
              options.forEach((element: IUserModalAddOptions) => {
                if (UserModalAddOptionsEnum[element.prop] == 'shownOnStart') {
                  scopeEndGame.setIsShowIntro(element.value)
                }
              })
            },
            image: warriorImg,
            options: [{
              value: true,
              prop: UserModalAddOptionsEnum.shownOnStart,
            }],
          })
        } else {
          scopeEndGame.startGame()
        }

        window.setTimeout(() => { this.onWindowResize() }, 100)
      } else {
        this._scopeEndGame.pause()
      }
    }

    if (eventDetail.property == GameStateSettings.selectedMap) {
      this.restartMainEngine()
    }
  }

  restartMainEngine() {
    if (!this.phaser || !this._scopeEndGame) return

    this._slotsSystem.cleanAllSlots()
    this._scopeEndGame.endGame()
    this.phaser.scene.stop(this._mainSceneName)
    this.startMainEngine()
  }

  onWindowResize() {
    const headerElement = this.gameApp?.shadowRoot?.querySelector('div.topElements')
    let topMargin = 0
    if (headerElement) {
      topMargin = Number(headerElement.clientHeight)
    }

    const winSizes: IResolution = {
      width: window.innerWidth,
      height: window.innerHeight - topMargin - 20,
    }

    const newSize: IResolution = {
      width: 0, height: 0,
    }

    if (!this._phConfig) {
      return
    }

    const width = this._phConfig.width as number
    const height = this._phConfig.height as number
    const gameProportion = width / height

    if (winSizes.width > winSizes.height) {
      newSize.width = gameProportion * winSizes.height
      if (newSize.width > winSizes.width) {
        newSize.width = winSizes.width
        newSize.height = winSizes.width / gameProportion
      } else {
        newSize.height = winSizes.height
      }
    } else {
      newSize.width = winSizes.width
      newSize.height = winSizes.width / gameProportion
    }
    if (this.phaser) {
      this.phaser.canvas.style.width = newSize.width + 'px'
      this.phaser.canvas.style.height = newSize.height + 'px'
    }
  }
}
