import {
  Languages,
} from '@/types/enums'

import {
  ILocalGameState
} from '@/types/main-types'

export class GameState implements ILocalGameState {

  isSound: boolean
  lang: Languages

  isGameStarted: boolean = false
  isMainMenu: boolean = true

  constructor(newParams?: ILocalGameState) {
      this.isSound = newParams?.isSound || true
      this.lang = newParams?.lang || Languages.ru
  }

  static SetNewValues(newValues: GameState): GameState {
    const newState = new GameState()
    Object.assign(newState, newValues)
    return newState
  }
}