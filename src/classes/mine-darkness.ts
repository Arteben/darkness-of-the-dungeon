import { BusEventsList } from '@/types/enums'

import { IJsonTranslatesType } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'
import { GameEngine } from '@/classes/game-engine'

import '@/game-app'
import { GameApp } from '@/game-app'

export let mineDarkness: MineDarkness

export class MineDarkness {
  state: GameState
  gameApp: GameApp
  loc: (a: string, b?: IJsonTranslatesType) => string
  engine?: GameEngine

  constructor(state: GameState, locals: Translates, gameApp: GameApp) {
    // get object with methods with translates
    this.state = state
    this.loc = locals.loc.bind(locals)
    this.gameApp = gameApp
  }

  dispatchStateChanges() {
    EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], this.state)
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

  // append gameApp elements to html
  body.appendChild(gameApp)

  // search and get convas for phaser
  mineDarkness.gameApp.canvasParent.then((parent: HTMLElement | null) => {
    if (!parent) return
    mineDarkness.gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
      if (!element) return
      mineDarkness.engine = new GameEngine(parent, element, state)
      EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], state)
    }, () => { })
  }, () => { })
}

export function Game() {
  return mineDarkness ? mineDarkness : null
}
