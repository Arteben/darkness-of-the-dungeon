import { GamePages, GameStateSettings } from '@/types/enums'

import { IJsonTranslatesType,
  IJsonMap,
  IResolution,
  GameStateChangeData
} from '@/types/main-types'

import { WEBGL, Types, Game as PhaserGame, Scene } from 'phaser'

import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'

import '@/game-app'
import { GameApp } from '@/game-app'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

import { MainEngine } from '@/classes/main-engine'

export let mineDarknessGame: MineDarkness | null = null

export function getMineDarknessGame() {
  return mineDarknessGame
}

export class MineDarkness {
  state: GameState

  loc: (a: string, b?: IJsonTranslatesType) => string

  phConfig: Types.Core.GameConfig = {
    width: 800,
    height: 384,
    // canvas: HTMLCanvasElement,
    // parent,
    scene: [],
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
  gameApp?: GameApp

  mainSceneName: string = 'MainEngine'

  constructor(state: GameState, locals: Translates) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    mineDarknessGame = this
    // get object with methods with translates
    this.state = state
    this.loc = locals.loc.bind(locals)

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

    EventBus.subscribeStateChanges(this.onChangeGameState, this)
    window.addEventListener('resize', (event: UIEvent) => { this.onWindowResize() })
  }

  startMainEngine() {
    if (!this.phaser) return
    this.phaser.scene.start(this.mainSceneName, { selectedMap: this.getSelectedMap() })
    this.phaser.pause()
  }

  createPhaserGame(canvas: HTMLCanvasElement, parentApp: HTMLElement, appElement: GameApp) {
    this.gameApp = appElement
    this.phConfig.parent = parentApp
    this.phConfig.canvas = canvas
    this.phaser = new PhaserGame(this.phConfig)
    this.phaser.scene.add(this.mainSceneName, MainEngine, false)
    this.startMainEngine()
  }

  getSelectedMap(): IJsonMap | null {
    const mapList = JsonMapList as IJsonMap[]
    const selectedMap = this.state.selectedMap

    if (!selectedMap)
      return null

    const findedMapIndex = mapList.findIndex((el) => el.name == selectedMap)
    if (findedMapIndex == -1)
      return null

    return mapList[findedMapIndex]
  }

  private onChangeGameState(data: any) {
    const eventDetail = data.detail as GameStateChangeData
    if (!this.phaser) return

    if (eventDetail.property == GameStateSettings.pages) {
      if (this.state.page == GamePages.game) {
        if (this.phaser.isPaused) {
          this.phaser.resume()
        }
        window.setTimeout(() => {this.onWindowResize()}, 100)
      } else if (!this.phaser.isPaused) {
        this.phaser.pause()
      }
    }

    if (eventDetail.property == GameStateSettings.selectedMap) {
      this.restartMainEngine()
    }
  }

  restartMainEngine() {
    if (!this.phaser) return
    this.phaser.scene.stop(this.mainSceneName)
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
      height: window.innerHeight - topMargin,
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
