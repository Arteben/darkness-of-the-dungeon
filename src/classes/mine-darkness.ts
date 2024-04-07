import {
  BusEventsList,
} from '@/types/enums'

import { ILocalGameState, IJsonTranslatesType } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'

export class MineDarkness {

  state: GameState
  appElement: HTMLElement
  loc: (a: string, b?: IJsonTranslatesType) => string

  constructor(rootElement: string, localState: ILocalGameState, locals: Translates) {
    this.loc = locals.loc.bind(locals)

    this.state = new GameState(localState)

    const appElement = document.createElement(rootElement)
    this.appElement = appElement

    const body = document.querySelector('body')
    if (body == null) {
      console.error('there isnt any body or app element for this document')
    } else {
      body.appendChild(appElement)
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

export function InitGame(rootElement: string, localState: ILocalGameState) {
  const locals = new Translates()
  game = new MineDarkness(rootElement, localState, locals)
  locals.game = game
  EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], game.state)
}

export function Game() {
  return game ? game : null
}
