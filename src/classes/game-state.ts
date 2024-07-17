import { Languages, BusEventsList, LocSettingsList } from '@/types/enums'
import { IHashParams, ILocSettingsEventLoad, ILocSettings } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { Game } from '@/classes/mine-darkness'

export class GameState implements IHashParams, ILocSettings {

  private _isRules: boolean = false
  private _isGame: boolean = false
  private _isMaps: boolean = false
  lang: Languages = Languages.eng
  private _isGameStarted: boolean = false
  private _isSound: boolean = true
  selectedMap?: string = undefined

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

  // isSound
  public get isSound(): boolean {
    return this._isSound
  }
  public set isSound(flag: boolean) {
    if (this._isSound != flag) {
      this._isSound = flag
      const evendLoad: ILocSettingsEventLoad =
        {type: LocSettingsList.isSound, value: flag}
      EventBus.Dispatch(
        BusEventsList[BusEventsList.changeLocSettings], evendLoad)
    }
  }
  //

  constructor(newParams?: IHashParams, locSettings?: ILocSettings) {
    if (newParams) {
      this.lang = newParams.lang
      this.isRules = newParams.isRules
      this.isGame = newParams.isGame
      this.isMaps = newParams.isMaps
    }

    if (locSettings) {
      this._isSound = locSettings.isSound
      this.selectedMap = locSettings.selectedMap
    }
  }

  static SetNewValues(newValues: GameState): GameState {
    const newState = new GameState()
    Object.assign(newState, newValues)
    return newState
  }

  static SubscribeAndUpdateStateChanges (callbackWihBindThis: (e: unknown) => void, that: any) {

    const eventBusCallback = (eventData: CustomEventInit) => {
      callbackWihBindThis.call(that, eventData)
    }

    EventBus.On(BusEventsList[BusEventsList.changeGameState], eventBusCallback)

    const game = Game()
    if (game) {
      const data: CustomEventInit = { detail: game.state }
      callbackWihBindThis.call(that, data)
    }

    return eventBusCallback
  }

  static OffStateChangesSubscribe (callback: (eventData: CustomEventInit) => void) {
    EventBus.off(BusEventsList[BusEventsList.changeGameState], callback)
  }
}