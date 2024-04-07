import {
  Languages,
} from '@/types/enums'

import {
  ILocalGameState
} from '@/types/main-types'

export class GameState implements ILocalGameState {

  isRules: boolean
  lang: Languages

  isGameStarted: boolean = false
  isMainMenu: boolean = true
  isSound: boolean = true

  constructor(newParams: ILocalGameState) {
    this.lang = newParams.lang
    this.isRules = newParams.isRules
  }

  static SetNewValues(newValues: GameState): GameState {
    const newState = new GameState({lang: Languages.eng, isRules: false})
    Object.assign(newState, newValues)
    return newState
  }
}