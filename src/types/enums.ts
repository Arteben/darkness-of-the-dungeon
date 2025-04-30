
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
  selectPocketItem,
  usePocketItem,
  trushPocketItem,
}

export enum GameStateSettings {
  isSound,
  selectedMap,
  pages,
  lang,
  isGameStarted,
  pocketItems,
  selectedPocketItem,
  isDudeDropAvailable,
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
  hand = 21,
  sword = 82,
  key = 185,
  apple = 224,
}

export enum EnvStaticElements {
  box = 48,
  torch = 50,
  door = 55,
  chest = 54,
  spawn = 13,
}

export enum SceneLevelZIndexes {
  dudeLevel = 4,
  pocketItemLevel = 2,// need two levels
  tipLevel = 7,
}

export enum ProgressBarTypes {
  usual,
  swordSwing,
}