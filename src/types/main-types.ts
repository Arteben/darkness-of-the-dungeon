import { Physics } from 'phaser'
import { GameState } from '@/classes/game-state'
import { PocketItem } from '@/classes/pocket-item'
import { PocketSlotsSystem } from '@/classes/pocket-slots-system'
import { NotificationsModalsSystem } from '@/classes/notifications-modals-system'
import { MapStaticElement, BoxStaticElement } from '@/classes/map-static-element'
import { Dude } from '@/classes/dude'
import { ScopeEndGame } from '@/classes/scope-and-end-game'

import {
  Languages,
  GamePages,
  GameStateSettings,
  DudeAnimations,
  ProgressBarTypes,
  UserNotificationTypes,
  UserModalAddOptionsEnum,
  DifficultyLevels,
} from '@/types/enums'

export type nullNumber = null | number;

export type ElementOrNull = HTMLElement | null;

export type VoidFunction = () => void;

export interface MainMenuEventData {
  isSound?: boolean
  newlang?: Languages
  isStarted?: boolean
}

export interface MainButtonType {
  type: string
  names: Array<string>
}

export interface MainButtonRenderInfo {
  type: string
  name: string
  hidden: boolean
}

export interface IHashParams {
  lang: Languages
  page: GamePages
}

export interface IJsonTranslatesType {
  [index: string]: { ru: string, eng: string }
}

export interface ILocSettings {
  isSound: boolean
  isShowGameIntro: boolean
  selectedMap?: ISelectedMap
}

export interface IJsonMap {
  name: string
  file: string
  level: DifficultyLevels
}

// phaser types
export interface IResolution {
  width: number
  height: number
}

export interface IMapTilesIndexes {
  [index: string]: number
}

export interface INumberCoords {
  w: number
  h: number
}

export interface IScreenSizes {
  x: number
  y: number
}

export interface ITilesCoords {
  x: number
  y: number
}
//

export interface mainKeys {
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  space: Phaser.Input.Keyboard.Key
  ctrl: Phaser.Input.Keyboard.Key
  a: Phaser.Input.Keyboard.Key
  d: Phaser.Input.Keyboard.Key
}

export type overlapCallbackParams =
  Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile

export type SelectedJsonMap = null | IJsonMap

export type GameStateChangeData = {
  state: GameState
  property: GameStateSettings
}

export interface IParamsForInitEngine {
  nameMap: string
  slotsSystem: PocketSlotsSystem
  modalsSystem: NotificationsModalsSystem
  scopeEndGame: ScopeEndGame
}

export interface ILoadedTileSets {
  walls: string
  env: string
  fon: string
}

export interface IAnimDudePlayParams {
  key: DudeAnimations
  isIgnoreIf: boolean
}

export interface ILastUserPushKye {
  duration: number
  time: number
  key: Phaser.Input.Keyboard.Key | null
}

export interface IPushKeysParams {
  value: boolean
  isDouble: boolean
}

export interface IPocketDroppedItemSprites {
  [index: string]: Physics.Arcade.Sprite[]
}

export interface IPocketItemStoreData {
  type: string
  coords: ITilesCoords
  cycled: boolean
}

export type PocketItemDudeData = IPocketItemStoreData | null

export interface IPocketItemTypes {
  [index: string]: PocketItem
}

export interface IEnvElementTypes {
  [index: string]: ((c: ITilesCoords) => MapStaticElement) | ((c: ITilesCoords) => BoxStaticElement)
}

export interface IListOFEnvStaticElements {
  [index: string]: MapStaticElement | BoxStaticElement
}

export interface ISpriteNumsForCombinedTip {
  main: number
  rightTop: number | undefined
  rightBottom: number | undefined
}

export type NumberNull = number | null

export type PocketItemNull = PocketItem | null

export type NullOrGameStateSettings = GameStateSettings[] | null

export type EnvElementNullData = MapStaticElement | null

export interface IProgressBarData {
  position: INumberCoords
  progress: number
  type: ProgressBarTypes
}

export type ProgressBarNullData = IProgressBarData | null

export interface IDudeProgressBarValues {
  // its persent (0-100)
  progress: number
  type: ProgressBarTypes
}

export type DudeProgresBarNullValues = IDudeProgressBarValues | null

export type DroppedItemsList = PocketItem[]

export type StaticEnvElementCallback = (a: ITilesCoords, b: Dude) => void

export interface INotificationData {
  text?: string
  type: UserNotificationTypes
}

export type NotificationNullData = INotificationData | null

export interface INotificationAnimTimeouts {
  start: number
  break: number
  hold: number
}

export interface IUserModalAddOptions {
  value: boolean
  prop: UserModalAddOptionsEnum
}

export interface IUserModalAddTitle {
  title: string
  value: string
  bigValue?: boolean
}

export type UserModalCallback = (a?: IUserModalAddOptions[]) => void

export interface IUserModalData {
  text: string
  image?: string
  options?: IUserModalAddOptions[]
  titles?: IUserModalAddTitle[]
  callback: UserModalCallback
}

export type UserModalNullData = IUserModalData | null

export interface ISelectedMap {
  type: string
  difficult: DifficultyLevels
}

export interface IAudioSpriteCollection {
  [index: number]: Phaser.Sound.WebAudioSound
}
