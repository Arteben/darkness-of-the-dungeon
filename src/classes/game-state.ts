import {
  Languages,
  BusEventsList,
  GamePages,
  GameStateSettings,
  FonMusicTypes,
} from '@/types/enums'
import {
  IHashParams,
  ILocSettings,
  GameStateChangeData,
  PocketItemNull,
  NotificationNullData,
  UserModalNullData,
  ISelectedMap,
  ICommonSoundValues,
} from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { offSoundValues } from '@/classes/sound-system'

export class GameState implements IHashParams, ILocSettings {


  // pages
  private _page: GamePages = GamePages.mainMenu
  public set page(page: GamePages) {
    if (page == this._page) return

    this._page = page
    this.triggerChnageState(GameStateSettings.pages)
  }
  public get page(): GamePages {
    return this._page
  }
  // lang
  private _lang: Languages = Languages.eng
  public set lang(lang: Languages) {
    if (this._lang == lang) return

    this._lang = lang
    this.triggerChnageState(GameStateSettings.lang)
  }
  public get lang(): Languages {
    return this._lang
  }
  //
  // isGameStarted
  private _isGameStarted: boolean = false
  public set isGameStarted(flag: boolean) {
    if (this._isGameStarted == flag) return

    this._isGameStarted = flag
    this.triggerChnageState(GameStateSettings.isGameStarted)
  }
  public get isGameStarted(): boolean {
    return this._isGameStarted
  }
  //
  // soundValues
  // 1 - max, 0 - turned off
  private _soundValues: ICommonSoundValues = { ...offSoundValues }

  public set soundValues(rawValues: ICommonSoundValues | null) {
    const values: ICommonSoundValues = (rawValues == null) ? { ...offSoundValues } : rawValues

    const hasEqualsValues = (old: ICommonSoundValues, newValues: ICommonSoundValues) => {
      return old.sfx == newValues.sfx && old.music == newValues.music
    }

    if (hasEqualsValues(this._soundValues, values)) return

    this._soundValues = values
    this.triggerChnageState(GameStateSettings.soundValues)
  }
  public get soundValues(): ICommonSoundValues {
    return this._soundValues
  }
  //

  // selected map
  private _hasSoundOn: boolean = true
  public set hasSoundOn(flag: boolean) {
    if (flag == this._hasSoundOn) return
    this._hasSoundOn = flag
    this.triggerChnageState(GameStateSettings.hasSoundOn)
  }
  public get hasSoundOn(): boolean {
    return this._hasSoundOn
  }
  //

  // selected map
  private _selectedMap?: ISelectedMap
  public set selectedMap(data: ISelectedMap) {
    if (data == this._selectedMap) return
    this._selectedMap = data
    this.triggerChnageState(GameStateSettings.selectedMap)
  }
  public get selectedMap(): ISelectedMap | undefined {
    return this._selectedMap
  }
  //
  // pocketItems
  private _pocketItems: PocketItemNull[] = []
  public set pocketItems(pocketItems: PocketItemNull[]) {
    this._pocketItems = pocketItems
    this.triggerChnageState(GameStateSettings.pocketItems)
  }
  public get pocketItems(): PocketItemNull[] {
    return this._pocketItems
  }
  //
  // selectedPocketItem
  private _selectedPocketItem: number = -1
  public set selectedPocketItem(idx: number) {
    this._selectedPocketItem = idx
    this.triggerChnageState(GameStateSettings.selectedPocketItem)
  }
  public get selectedPocketItem(): number {
    return this._selectedPocketItem
  }
  //

  // isDudeDropAvailable
  private _isDudeDropAvailable: boolean = true
  public set isDudeDropAvailable(idx: boolean) {
    this._isDudeDropAvailable = idx
    this.triggerChnageState(GameStateSettings.isDudeDropAvailable)
  }
  public get isDudeDropAvailable(): boolean {
    return this._isDudeDropAvailable
  }
  //

  // userNotification
  private _userNotification: NotificationNullData = null
  public set userNotification(data: NotificationNullData) {
    if (data == this._userNotification) return

    this._userNotification = data
    this.triggerChnageState(GameStateSettings.userNotification)
  }
  public get userNotification(): NotificationNullData {
    return this._userNotification
  }
  //

  // userModal
  private _userModal: UserModalNullData = null
  public set userModal(data: UserModalNullData) {
    if (data == this._userModal) return

    this._userModal = data
    this.triggerChnageState(GameStateSettings.userDialogModal)
  }
  public get userModal(): UserModalNullData {
    return this._userModal
  }
  //

  // isShowGameIntro
  private _isShowGameIntro: boolean = true
  public set isShowGameIntro(flag: boolean) {
    if (flag == this._isShowGameIntro) return

    this._isShowGameIntro = flag
    this.triggerChnageState(GameStateSettings.isShowGameIntro)
  }
  public get isShowGameIntro(): boolean {
    return this._isShowGameIntro
  }
  //

  // typeFonMusic
  private _typeFonMusic: FonMusicTypes = FonMusicTypes.none
  public set typeFonMusic(typeMusic: FonMusicTypes) {
    if (typeMusic == this._typeFonMusic) return

    this._typeFonMusic = typeMusic
    this.triggerChnageState(GameStateSettings.typeFonMusic)
  }
  public get typeFonMusic(): FonMusicTypes {
    return this._typeFonMusic
  }


  constructor(newParams?: IHashParams, locSettings?: ILocSettings) {
    if (newParams) {
      this.lang = newParams.lang
      this.page = newParams.page
    }

    if (locSettings) {
      this._soundValues = locSettings.soundValues
      this._hasSoundOn = locSettings.hasSoundOn
      this._selectedMap = locSettings.selectedMap
      this._isShowGameIntro = locSettings.isShowGameIntro
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
