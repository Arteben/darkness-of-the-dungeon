import { IconTip } from '@/classes/icon-tip'

import {
  Languages,
  LocSettingsList,
  GamePages,
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
  selectedMap?: string
}

export type locSettingsValue = string | boolean

export interface ILocSettingsEventLoad {
  type: LocSettingsList
  value: locSettingsValue
}

export interface IJsonMap {
  name: string
  file: string
  level: string
}

export interface IStateParams extends IHashParams, ILocSettings {
  lang: Languages
  page: GamePages
  isGameStarted: boolean
  isSound: boolean
  selectedMap?: string
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
  shift: Phaser.Input.Keyboard.Key
  a: Phaser.Input.Keyboard.Key
  d: Phaser.Input.Keyboard.Key
}

export type overlapCallbackParams =
  Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile

export interface IconTips {
  [index: string]: IconTip
}
