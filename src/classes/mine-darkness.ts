import { BusEventsList } from '@/types/enums'

import { IHashParams, IJsonTranslatesType } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'
import { GameEngine } from '@/classes/game-engine'

import '@/game-app'
import { GameApp } from '@/game-app'

export class MineDarkness {

  state: GameState
  gameApp: GameApp
  loc: (a: string, b?: IJsonTranslatesType) => string

  constructor(localState: IHashParams, locals: Translates) {
    this.state = new GameState(localState)
    this.loc = locals.loc.bind(locals)
    locals.game = this
    this.gameApp = document.createElement('game-app')
    const body = document.querySelector('body')
    if (body == null) {
      console.error('there isnt any body or app element for this document')
    } else {
      body.appendChild(this.gameApp)
    }
  }

  SetNewStateValues(newState: GameState) {
    this.state = GameState.SetNewValues(newState)
    EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], this.state)
  }

  setLocFunc(locs: Translates) {
    this.loc = locs.loc.bind(locs)
  }
}

let game: MineDarkness

export function InitGame(localState: IHashParams) {
  const locals = new Translates()
  game = new MineDarkness(localState, locals)
  // create phaser canvas
  game.gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
    if (!element) return
    new GameEngine(element, game)
    EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], game.state)
  }, () => {})
}

export function Game() {
  return game ? game : null
}
