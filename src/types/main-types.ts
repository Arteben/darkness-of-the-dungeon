import { GameState } from '@/classes/game-state'
import {
  Languages,
} from '@/types/enums'

export type nullNumber = null | number;

export type ElementOrNull = HTMLElement | null;

export type VoidFunction = () => void;

export interface MainMenuEventData {
  isSound?: boolean
  newlang?: Languages
  isStarted?: boolean
}

export interface ChangeGameStateData {
  detail: GameState
}

export interface MainButtonType {
  type: string
  hidden: boolean
  names: Array<string>
}

export interface MainButtonRenderInfo {
  type: string
  hidden: boolean
  name: string
}

export interface IHashParams {
  lang: Languages
  isRules: boolean
  isGame: boolean
  isMaps: boolean
}

export interface IJsonTranslatesType {
  [index: string]: {ru: string, eng: string}
}
