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

  constructor(localState: IHashParams, locSettings: ILocSettings, gameApp: GameApp) {
    // get object with methods with translates
    this.state = new GameState(localState, locSettings)

    const locals = new Translates(this.state)

    this.loc = locals.loc.bind(locals)
    this.gameApp = gameApp
  }

  dispatchStateChanges() {
    EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], this.state)
  }
}

let game: MineDarkness

export function InitGame(localState: IHashParams, locSettings: ILocSettings) {
  const gameApp = document.createElement('game-app')
  game = new MineDarkness(localState, locSettings, gameApp)

  const body = document.querySelector('body')
  if (gameApp == null || body == null) {
    console.error('BODY OR GameApp equals null')
    return
  }

  // append gameApp elements to html
  body.appendChild(gameApp)

  // search and get convas for phaser
  game.gameApp.canvasParent.then((parent: HTMLElement | null) => {
    if (!parent) return
    game.gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
      if (!element) return
      new GameEngine(parent, element, game)
      EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], game.state)
    }, () => { })
  }, () => { })
}

export function Game() {
  return game ? game : null
}
