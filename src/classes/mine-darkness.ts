import { BusEventsList, GamePages } from '@/types/enums'

import { IJsonTranslatesType, IJsonMap } from '@/types/main-types'

import { WEBGL, Types, Game as PhaserGame } from 'phaser'
import { IResolution } from '@/types/phaser-types'

import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'

import '@/game-app'
import { GameApp } from '@/game-app'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

import { MainEngineScene } from '@/classes/main-engine-scene'

export let mineDarknessGame: MineDarkness | null = null

export function setMineDarknessGame(game: MineDarkness) {
  return mineDarknessGame = game
}

export class MineDarkness {
  state: GameState
  gameApp: GameApp
  loc: (a: string, b?: IJsonTranslatesType) => string
  phConfig: Types.Core.GameConfig = {
    width: 640,
    height: 384,
    // canvas: HTMLCanvasElement,
    // parent,
    // scene: [this.mainScene],
    type: WEBGL,
    backgroundColor: '#1b262c',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 300 },
        debug: false
      }
    },
  }

  phaser?: PhaserGame

  constructor(state: GameState, locals: Translates, gameApp: GameApp) {
    // get object with methods with translates
    this.state = state
    this.loc = locals.loc.bind(locals)

    this.gameApp = gameApp

    this.phConfig.scene = [new MainEngineScene('main-scene')]

    // select any map if map not selected!
    if (!this.getSelectedMap()) {
      const mapList = JsonMapList as IJsonMap[]
      if (mapList.length > 0) {
        this.state.selectedMap = mapList[0].name
      } else {
        console.error('MAPS arent unviable')
        return
      }
    }

    this.subscribeStateChanges(this.onChangeGameState, this)
    window.addEventListener('resize', (event: UIEvent) => { this.onWindowResize() })
  }

  createPhaserGame(canvas: HTMLCanvasElement, parentApp: HTMLElement) {
    this.phConfig.parent = parentApp
    this.phConfig.canvas = canvas
    this.phaser = new PhaserGame(this.phConfig)
    this.phaser.pause()
  }

  subscribeStateChanges(callbackWihBindThis: (e: unknown) => void, that: any) : (eventData: CustomEventInit) => void {
     const eventBusCallback = (eventData: CustomEventInit) => {
      callbackWihBindThis.call(that, eventData)
    }
    EventBus.On(BusEventsList[BusEventsList.changeGameState], eventBusCallback)
    return eventBusCallback
  }

  subscribeAndUpdateStateChanges(callbackWihBindThis: (e: unknown) => void, that: any) {
    const eventBusCallback = this.subscribeStateChanges(callbackWihBindThis, that)
    const data: CustomEventInit = { detail: this.state }
    callbackWihBindThis.call(that, data)
    return eventBusCallback
  }

  offStateChangesSubscribe(callback: (eventData: CustomEventInit) => void) {
    EventBus.off(BusEventsList[BusEventsList.changeGameState], callback)
  }

  getSelectedMap() {
    const mapList = JsonMapList as IJsonMap[]
    const selectedMap = this.state.selectedMap

    if (!selectedMap)
      return ''

    const findedMapIndex = mapList.findIndex((el) => el.name == selectedMap)
    if (findedMapIndex == -1)
      return ''

    return mapList[findedMapIndex]
  }

  private onChangeGameState() {
    if (!this.phaser) {
      return
    }

    if (this.state.page == GamePages.game) {
      if (this.phaser.isPaused) { this.phaser.resume() }
    } else if (!this.phaser.isPaused) {
      this.phaser.pause()
    }
  }

  onWindowResize() {
    const winSizes: IResolution = {
      width: window.innerWidth, height: window.innerHeight,
    }

    const newSize: IResolution = {
      width: 0, height: 0,
    }

    if (!this.phConfig) {
      return
    }

    const width = this.phConfig.width as number
    const height = this.phConfig.height as number
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
