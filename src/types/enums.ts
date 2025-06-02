
export enum Languages {
  ru,
  eng,
}

export enum DifficultyLevels {
  easy,
  middle,
  hard,
  veryhard,
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
  notificationClick,
  userModalOk,
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
  userNotification,
  userDialogModal,
  isShowGameIntro,
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
  key = 185,
  apple = 224,
  rock = 11,
  smolBranch = 170,
}

export enum EnvStaticElements {
  box = 6,
  openedBox = 12,
  bigBox = 7,
  openedBigBox = 13,
  barrels = 18,
  openedBarrels = 19,
  bigBarrel = 24,
  openedBigBarrel = 25,
  torch = 2,
  door = 26,
  topDoor = 20,
  chest = 4,
  openedChest = 5,
  fire = 9,
  extFire = 10,
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

export enum UserNotificationTypes {
  error,
  ok,
  start,
  break,
}

export enum UserModalAddOptionsEnum {
  shownOnStart,
}

export enum ScopeActions {
  searchBox,
  difficultLevel,
  onTimes,
}

export enum SoundLevels {
  dudeMoveSounds,
  dudeActionSounds,
}

export enum DudeMoveSounds {
  walk,
  run,
  climbing,
}

export enum DudeActionSounds {
  searchBox,
  searchChest,
  getItem,
  getKey,
  searchCampfire,
}
