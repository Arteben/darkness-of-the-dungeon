
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
  charTwitching,
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
  ground,
  envWithBoxes,
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

export enum PocketItemsEnum {
  hand = 21,
  sword = 82,
  key = 185,
  apple = 224,
}

export enum EnvStaticElements {
  box = 48,
  usedBox = 5,
  bigBox = 49,
  barrels = 20,
  bigBarrel = 28,
  torch = 50,
  door = 55,
  chest = 54,
  spawn = 13,
}

export enum SceneLevelZIndexes {
  dudeLevel = 2,
  pocketItemLevel = 3,// need two levels
  tipLevel = 5,
  progressBarLevel = 6,
}

export enum ProgressBarTypes {
  usual,
  swordSwing,
}