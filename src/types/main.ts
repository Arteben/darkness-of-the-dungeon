import {
  languages,
  difficultyLevels,
} from '@/types/enums'

export type nullNumber = null | number;

export interface menuGameSettings {
  hasSound: boolean
  lang: languages
  difficultLevel: difficultyLevels
}

export type elementOrNull = HTMLElement | null;

export type voidFunction = () => void;

export interface menuCallbacks {
  startButtonClick: voidFunction
}

export interface gameState {
  isShowMainMenu: boolean
  isGameStarted: boolean
  isSound: boolean
}
