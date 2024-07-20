import { BusEventsList } from '@/types/enums'

import { IJsonTranslatesType, IJsonMap } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'
import { GameEngine } from '@/classes/game-engine'

import '@/game-app'
import { GameApp } from '@/game-app'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

export let mineDarkness: MineDarkness

export class MineDarkness {
  state: GameState
  gameApp: GameApp
  loc: (a: string, b?: IJsonTranslatesType) => string
  engine: GameEngine

  constructor(state: GameState, locals: Translates, gameApp: GameApp) {
    // get object with methods with translates
    this.state = state
    this.loc = locals.loc.bind(locals)
    this.gameApp = gameApp
    this.engine = new GameEngine(state)
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
}

export function InitGame(state: GameState, locals: Translates) {
  const gameApp = document.createElement('game-app')

  mineDarkness = new MineDarkness(state, locals, gameApp)

  const body = document.querySelector('body')
  if (gameApp == null || body == null) {
    console.error('BODY OR GameApp equals null')
    return
  }

  // select any map if map not selected!

  // append gameApp elements to html
  body.appendChild(gameApp)

  // search and get convas for phaser
  mineDarkness.gameApp.canvasParent.then((parent: HTMLElement | null) => {
    if (!parent) return
    mineDarkness.gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
      if (!element) return
      mineDarkness.engine.createEngine(parent, element)
      EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], state)
    }, () => { })
  }, () => { })
}

export function Game() {
  return mineDarkness ? mineDarkness : null
}
