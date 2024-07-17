import { BusEventsList } from '@/types/enums'

import { IHashParams, IJsonTranslatesType, ILocSettings } from '@/types/main-types'

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

  constructor(localState: IHashParams, locSettings: ILocSettings, locals: Translates, gameApp: GameApp) {
    this.state = new GameState(localState, locSettings)
    this.loc = locals.loc.bind(locals)
    locals.game = this
    this.gameApp = gameApp
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

export function InitGame(localState: IHashParams, locSettings: ILocSettings) {
  // append gameApp elements to html
  const gameApp = document.createElement('game-app')
  const body = document.querySelector('body')
  if (body == null || gameApp == null) {
    return
  }
  body.appendChild(gameApp)
  // get object with methods with translates
  const locals = new Translates()
  game = new MineDarkness(localState, locSettings, locals, gameApp)
  // search and get convas for phaser
  game.gameApp.canvasParent.then((parent: HTMLElement | null) => {
    if (!parent) return
    game.gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
      if (!element) return
      new GameEngine(parent, element, game)
      EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], game.state)
    }, () => {})
  }, () => {})
}

export function Game() {
  return game ? game : null
}
