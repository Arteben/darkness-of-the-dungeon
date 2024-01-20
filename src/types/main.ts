import {
  Languages,
} from '@/types/enums'

export type nullNumber = null | number;

export interface GameState {
  isSound: boolean
  lang: Languages
  isStarted: boolean
  isMainMenu: boolean
  isElementsLoaded: boolean
  isPhaserLoaded: boolean
}

export type ElementOrNull = HTMLElement | null;

export type VoidFunction = () => void;
