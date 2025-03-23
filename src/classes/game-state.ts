import { Languages, BusEventsList, GamePages, GameStateSettings } from '@/types/enums'
import {
  IHashParams,
  ILocSettings,
  IStateParams,
  GameStateChangeData,
  IPacketSlot,
} from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'

export class GameState implements IStateParams {

  private _page: GamePages = GamePages.mainMenu
  private _lang: Languages = Languages.eng
  private _isGameStarted: boolean = false
  private _isSound: boolean = true
  private _selectedMap?: string

  // pages
  public set page(page: GamePages) {
    this._page = page
    this.triggerChnageState(GameStateSettings.pages)
  }
  public get page(): GamePages {
    return this._page
  }
  // lang
  public set lang(lang: Languages) {
    this._lang = lang
    this.triggerChnageState(GameStateSettings.lang)
  }
  public get lang(): Languages {
    return this._lang
  }
  //
  // isGameStarted
  public set isGameStarted(flag: boolean) {
    this._isGameStarted = flag
    this.triggerChnageState(GameStateSettings.isGameStarted)
  }
  public get isGameStarted(): boolean {
    return this._isGameStarted
  }
  //
  // isSound
  public set isSound(flag: boolean) {
    if (this._isSound != flag) {
      this._isSound = flag
      this.triggerChnageState(GameStateSettings.isSound)
    }
  }
  public get isSound(): boolean {
    return this._isSound
  }
  //
  // selected map
  public set selectedMap(str: string) {
    if (this._selectedMap != str) {
      this._selectedMap = str
      this.triggerChnageState(GameStateSettings.selectedMap)
    }
  }
  public get selectedMap(): string | undefined {
    return this._selectedMap
  }
  //
  // pocketSlots
  private _pocketSlots: IPacketSlot[] = []
  public set pocketSlots(pocketSlots: IPacketSlot[]) {
    this._pocketSlots = pocketSlots
    this.triggerChnageState(GameStateSettings.pocketSlots)
  }
  public get pocketSlots(): IPacketSlot[] {
    return this._pocketSlots
  }
  //

  constructor(newParams?: IHashParams, locSettings?: ILocSettings) {
    if (newParams) {
      this.lang = newParams.lang
      this.page = newParams.page
    }

    if (locSettings) {
      this._isSound = locSettings.isSound
      this._selectedMap = locSettings.selectedMap
    }
  }

  triggerChnageState(prop: GameStateSettings) {
    const data: GameStateChangeData = {
      property: prop,
      state: this
    }
    EventBus.Dispatch(BusEventsList[BusEventsList.changeGameState], data)
  }
}
