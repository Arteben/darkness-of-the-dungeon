import {
  Languages,
} from '@/types/enums'

import { IHashParams } from '@/types/main-types'

export class GameState implements IHashParams {

  private _isRules: boolean = false
  private _isGame: boolean = false
  private _isMaps: boolean = false
  lang: Languages = Languages.eng
  private _isGameStarted: boolean = false
  // private _isMainMenu: boolean = true
  isSound: boolean = true

  // isRules //
  public get isRules(): boolean {
    return this._isRules
  }
  public set isRules(flag: boolean) {
    if (flag) {
      this.isMaps = false
      this.isGame = false
    }
    this._isRules = flag
  }
  //
  // isGame
  public get isGame(): boolean {
    return this._isGame
  }
  public set isGame(flag: boolean) {
    if (flag) {
      this.isMaps = false
      this.isRules = false
    }
    this._isGame = flag
  }
  //
  // isMaps //
  public get isMaps(): boolean {
    return this._isMaps
  }
  public set isMaps(flag: boolean) {
    if (flag) {
      this.isGame = false
      this.isRules = false
    }
    this._isMaps = flag
  }
  //
  // isGameStarted
  public get isGameStarted(): boolean {
    return this._isGameStarted
  }
  public set isGameStarted(flag: boolean) {
    this._isGameStarted = flag
  }
  //
  // isMainMenu
  public get isMainMenu(): boolean {
    return !(this.isRules || this.isGame || this.isMaps)
  }
  public set isMainMenu(flag: boolean) {
    if (flag) {
      this.isRules = false
      this.isGame = false
      this.isMaps = false
    }
  }
  //

  constructor(newParams?: IHashParams) {
    if (newParams) {
      this.lang = newParams.lang
      this.isRules = newParams.isRules
      this.isGame = newParams.isGame
      this.isMaps = newParams.isMaps
    }
  }

  static SetNewValues(newValues: GameState): GameState {
    const newState = new GameState()
    Object.assign(newState, newValues)
    return newState
  }
}