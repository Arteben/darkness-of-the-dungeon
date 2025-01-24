import { BusEventsList } from '@/types/enums'

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

export let mineDarkness: MineDarkness | null = null

const phaserConfig = {
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

export class MineDarkness {
  state: GameState
  gameApp: GameApp
  loc: (a: string, b?: IJsonTranslatesType) => string
  phConfig: Types.Core.GameConfig = phaserConfig
  game?: PhaserGame

  constructor(state: GameState, locals: Translates, gameApp: GameApp) {
    // get object with methods with translates
    this.state = state
    this.loc = locals.loc.bind(locals)

    this.gameApp = gameApp

    this.phConfig.scene = [ new MainEngineScene('main-scene') ]

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

    GameState.SubscribeAndUpdateStateChanges(this.onChangeGameState, this)
    window.addEventListener('resize',(event: UIEvent) => { this.onWindowResize() })
  }

  createPhaserGame(canvas: HTMLCanvasElement, parentApp: HTMLElement) {
    this.phConfig.parent = parentApp
    this.phConfig.canvas = canvas
    this.game = new PhaserGame(phaserConfig)
    this.game.pause()
  }

  dispatchStateChanges() {
    EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], this.state)
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

  private onChangeGameState () {
    if (!this.game) {
      return
    }

    if (this.state.isGame) {
      if (this.game.isPaused) { this.game.resume() }
    } else if (!this.game.isPaused) {
      this.game.pause()
    }
  }

  onWindowResize () {
    const winSizes: IResolution = {
      width: window.innerWidth, height: window.innerHeight,
    }

    const newSize: IResolution = {
      width: 0, height: 0,
    }

    const gameProportion = phaserConfig.width / phaserConfig.height

    if (winSizes.width > winSizes.height) {
      newSize.width = gameProportion * winSizes.height
      if (newSize.width > winSizes.width) {
        newSize.width = winSizes.width
        newSize.height = winSizes.width / gameProportion
      } else {
        newSize.height = winSizes.height
      }
    }  else {
      newSize.width = winSizes.width
      newSize.height =winSizes.width / gameProportion
    }
    if (this.game) {
      this.game.canvas.style.width = newSize.width + 'px'
      this.game.canvas.style.height = newSize.height + 'px'
    }
  }
}

export function InitGame(state: GameState, locals: Translates) {
  const gameApp = document.createElement('game-app')
  const body = document.querySelector('body')
  if (gameApp == null || body == null) {
    console.error('BODY OR GameApp equals null')
    return
  }

  mineDarkness = new MineDarkness(state, locals, gameApp)

  // append gameApp elements to html
  body.appendChild(gameApp)

  // search and get convas for phaser
  gameApp.canvasParent.then((parent: HTMLElement | null) => {
    if (!parent) return
    gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
      if (!element) return
      mineDarkness?.createPhaserGame(element, parent)
      mineDarkness?.dispatchStateChanges()
      mineDarkness?.onWindowResize()
    }, () => { })
  }, () => { })
}

export function getMineDarkness() {
  return mineDarkness
}
