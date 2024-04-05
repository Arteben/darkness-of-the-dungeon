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
