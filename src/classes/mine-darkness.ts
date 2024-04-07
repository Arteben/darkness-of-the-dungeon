import {
  BusEventsList,
} from '@/types/enums'

import { ILocalGameState } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'

class MineDarkness {

  state: GameState
  appElement: HTMLElement

  constructor(rootElement: string, localState: ILocalGameState) {
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
    EventBus.Dispatch(BusEventsList.changeGameState, this.state)
  }
}

let game: MineDarkness

export function InitGame(rootElement: string, localState: ILocalGameState) {
  game = new MineDarkness(rootElement, localState)
  EventBus.Dispatch(BusEventsList.initGame, game)
}

export function Game(): MineDarkness | null {
  return game ? game : null
}
