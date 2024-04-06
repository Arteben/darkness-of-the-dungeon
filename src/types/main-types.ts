import { GameState } from '@/classes/game-state'
import {
  Languages,
} from '@/types/enums'

export type nullNumber = null | number;

export interface ILocalGameState {
  isSound: boolean
  lang: Languages
}

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
  icons?: Array<string>
}

export interface MainButtonRenderInfo {
  type: string
  hidden: boolean
  name: string
  icons?: string
}
