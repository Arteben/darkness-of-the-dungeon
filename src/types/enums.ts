
export enum Languages {
  ru,
  eng,
}

export enum DifficultyLevels {
  easy,
  middle,
  hard,
}

export enum ImportantDomElementIds {
  phaserCanvasId = 'phaser-canvas-id',
}

export enum BusEventsList {
  changeGameState,
  changeLocSettings,
}

export enum GameStateSettings {
  isSound,
  selectedMap,
  pages,
  lang,
  isGameStarted,
  pocketSlots,
}

export enum GamePages {
  mainMenu,
  rules,
  game,
  maps,
}

export enum DudeStates {
  idle,
  walk,
  climbing,
  fighting,
  run,
}

export enum DudeClimbingTypes {
  up,
  down,
  stand,
}

export enum TileSetModificators {
  none,
  ladders,
  ground
}

export enum DudeAnimations {
  idle,
  walking,
  climbingUp,
  climbingDown,
  climbingStand,
  run,
}

export enum CheckSymMapElements {
  empty,
  ladder,
  wall,
}

export enum PocketItems {
  hand = 0,
  rock = 1,
  key = 3,
  apple = 224,
}