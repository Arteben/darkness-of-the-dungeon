
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

export enum LocSettingsList {
  isSound,
  selectedMap
}

export enum GamePages {
  mainMenu,
  rules,
  game,
  maps,
}

export enum DudeStates {
  walk,
  climbing,
  fighting,
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