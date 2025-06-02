import { GameObjects, Types, Physics } from 'phaser'

import { EventBus } from '@/classes/event-bus'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'
import { DroppedItemsSystem as DropItems, DroppedItemsSystem } from '@/classes/dropped-items-system'
import { IconTips } from '@/classes/icon-tips'
import { PocketSlotsSystem } from '@/classes/pocket-slots-system'
import { PocketItem } from '@/classes/pocket-item'
import { DudeProgressBar } from '@/classes/dude-progress-bar'
import { EnvStaticMapElementTypes } from '@/classes/env-static-map-element-types'
import { NotificationsModalsSystem } from '@/classes/notifications-modals-system'
import { ScopeEndGame } from '@/classes/scope-and-end-game'
import { SoundSystem } from '@/classes/sound-system'

import { isAllNull } from '@/utils/usefull'

import {
  IResolution,
  INumberCoords,
  mainKeys,
  IAnimDudePlayParams,
  ITilesCoords,
  ILastUserPushKye,
  IPushKeysParams,
  overlapCallbackParams,
  PocketItemDudeData,
  ISpriteNumsForCombinedTip,
  EnvElementNullData,
  DudeProgresBarNullValues,
  IListOFEnvStaticElements,
} from '@/types/main-types'

import {
  DudeClimbingTypes,
  DudeStates,
  DudeAnimations,
  CheckSymMapElements,
  PocketItemsEnum,
  SceneLevelZIndexes,
  ProgressBarTypes,
  BusEventsList,
  SoundLevels as SoundLV,
  DudeMoveSounds as MoveSounds,
} from '@/types/enums'

export class Dude {
  _playerBody: Physics.Arcade.Body
  _playerSprite: GameObjects.Sprite
  _dudeStay: boolean = true
  _frameResolution: IResolution
  _levels: MapSceneLevels
  _camera: SceneCamera
  _tips: IconTips
  dropItems: DroppedItemsSystem
  _slotSystem: PocketSlotsSystem
  _progressBar: DudeProgressBar
  _staticElementsList: IListOFEnvStaticElements
  scopeEndGame: ScopeEndGame
  sounds: SoundSystem

  userModals: NotificationsModalsSystem

  _tilePointer: Phaser.GameObjects.Arc | null = null

  _runTimeout: number | undefined

  _maxFallSpeed: number = 600

  // @ts-ignore // isNearLadder
  private _isNearLadder: boolean
  public set isNearLadder(flag: boolean) {
    if (flag == this._isNearLadder) return

    this._playerBody.setAllowGravity(!flag)
    this._isNearLadder = flag
  }
  public get isNearLadder(): boolean {
    return this._isNearLadder
  }
  //

  // @ts-ignore // isDudeState
  private _dudeMoveState: DudeStates
  public set dudeMoveState(newState: DudeStates) {
    if (this.dudeMoveStateUpdating(newState)) {
      this._dudeMoveState = newState
    }
  }
  public get dudeMoveState(): DudeStates {
    return this._dudeMoveState
  }

  // climbing up OR down here?
  private _climbingType: DudeClimbingTypes = DudeClimbingTypes.stand
  public set climbingType(newValue: DudeClimbingTypes) {
    if (newValue == this._climbingType) return

    this._climbingType = newValue
  }
  public get climbingType(): DudeClimbingTypes {
    return this._climbingType
  }

  // isLeftKeys
  private _isLeftMove: boolean = false
  public set isLeftMove({ value, isDouble }: IPushKeysParams) {
    this.leftRightKyesUpdating(value, this._isLeftMove, isDouble, true)
    this._isLeftMove = value
  }
  public get isLeftMove(): boolean {
    return this._isLeftMove
  }
  //

  // isRightKeys
  private _isRightMove: boolean = false
  public set isRightMove({ value, isDouble }: IPushKeysParams) {
    this.leftRightKyesUpdating(value, this._isRightMove, isDouble, false)
    this._isRightMove = value
  }
  public get isRightMove(): boolean {
    return this._isRightMove
  }
  //

  // isUpKye
  private _isUpMove: boolean = false
  public set isUpMove({ value, isDouble }: IPushKeysParams) {
    if (value == this._isUpMove) return

    if (this.dudeMoveState != DudeStates.fighting) {
      this.upDownSimpleMoveUpdaiting(value, DudeClimbingTypes.up)
    }

    this._isUpMove = value
  }
  public get isUpMove(): boolean {
    return this._isUpMove
  }
  //

  // isDownKye
  private _isDownMove: boolean = false
  public set isDownMove({ value, isDouble }: IPushKeysParams) {
    if (value == this._isDownMove) return

    if (this.dudeMoveState != DudeStates.fighting) {
      this.upDownSimpleMoveUpdaiting(value, DudeClimbingTypes.down)
    }
    this._isDownMove = value
  }
  public get isDownMove(): boolean {
    return this._isDownMove
  }
  //

  // animation key for dude
  private _dudeAnimationKey: DudeAnimations = DudeAnimations.idle
  public set dudeAnimationKey({ key, isIgnoreIf }: IAnimDudePlayParams) {
    switch (key) {
      case DudeAnimations.idle:
      case DudeAnimations.walking:
        this.setPlayerSpriteFlip()
    }
    this._playerSprite.anims.play(Dude.getAnimKey(key), isIgnoreIf)
    this._dudeAnimationKey = key
  }
  public get dudeAnimationKey(): DudeAnimations {
    return this._dudeAnimationKey
  }
  //

  //space key for dude
  private _isSpaceDown: boolean = false
  public set isSpaceDown(flag: boolean) {
    if (flag != this._isSpaceDown) {
      const selectedItem = this._slotSystem.selectedItem
      if (flag && selectedItem != null) {
        selectedItem.use(this)
      }
      this._isSpaceDown = flag
    }
  }
  public get isSpaceDown(): boolean {
    return this._isSpaceDown
  }
  //

  //ctrl key for dude
  private _isCtrlDow: boolean = false
  public set isCtrlDow(flag: boolean) {
    if (flag != this._isCtrlDow) {
      if (flag) this.itarateThings()
      this._isCtrlDow = flag
    }
  }
  public get isCtrlDow(): boolean {
    return this._isCtrlDow
  }
  //

  // overlapSomeItem
  private _pocketItemCollisionData: PocketItemDudeData = null
  public set pocketItemCollisionData(droppedItemData: PocketItemDudeData) {
    if (isAllNull(this._pocketItemCollisionData, droppedItemData)) {
      return
    }

    if (droppedItemData != null && this._slotSystem.isFullSlots()) {
      droppedItemData = null
    }
    this._pocketItemCollisionData = droppedItemData
    this.showPickupItemTip(droppedItemData)
  }
  public get pocketItemCollisionData(): PocketItemDudeData {
    return this._pocketItemCollisionData
  }
  //

  // overlapping with some env element
  private _envCollisionElementData: EnvElementNullData = null
  public set envCollisionElementData(newElement: EnvElementNullData) {
    if (isAllNull(this._envCollisionElementData, newElement)) {
      return
    }

    this.showEnvElementTip(newElement)
    this._envCollisionElementData = newElement
  }
  public get envCollisionElementData(): EnvElementNullData {
    return this._envCollisionElementData
  }

  private _progressBarValues: DudeProgresBarNullValues = null
  public set progressBarValues(values: DudeProgresBarNullValues) {
    if (isAllNull(this._progressBarValues, values)) {
      return
    }

    const getHash = (objValues: DudeProgresBarNullValues) => {
      let sum = 0
      if (objValues == null) {
        return sum += 300
      }
      sum += (objValues.type == ProgressBarTypes.swordSwing) ? 200 : 0
      return sum += objValues.progress
    }

    if (getHash(this._progressBarValues) == getHash(values)) {
      return
    }

    this._progressBarValues = values
    this.updateProgressBar()
  }
  public get progressBarValues(): DudeProgresBarNullValues {
    return this._progressBarValues
  }

  // flip animation for left | right animations
  _isFlipXAnimations: boolean = false

  _lastTapKey: ILastUserPushKye = {
    duration: 0,
    key: null,
    time: 0,
  }

  constructor(
    engine: MainEngine,
    mapLevels: MapSceneLevels,
    camera: SceneCamera,
    tips: IconTips,
    dropItems: DropItems,
    keyAnimFrameSet: string,
    frameResolution: IResolution,
    staticElementsList: IListOFEnvStaticElements
  ) {

    this._levels = mapLevels
    this._camera = camera
    this.dropItems = dropItems
    this._tips = tips
    this._slotSystem = engine.slotSystem
    // set function for drop elements
    this._slotSystem.dropFunc = (item: PocketItem) => {
      const plCrds = this.getTilePlayerCoords()
      return this.dropItems.drop(plCrds, item)
    }
    this._slotSystem.useFunc = (item: PocketItem) => {
      item.use(this)
    }
    this._slotSystem.calcAvailableDrop = () => {
      this.calcsForDropAvailable()
    }

    this.scopeEndGame = engine.scopeEndGame

    this._frameResolution = frameResolution
    this._staticElementsList = staticElementsList

    // set animation frame size for our levels
    // magic numbers
    const dudeScale = 1.6
    const correctSpriteOffsetY = (-0.3)

    const startMapCoords = this._levels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frameResolution.width * 0.5
      startCoords.h = startMapCoords.h
    }

    const container = engine.add.container(startCoords.w, startCoords.h)
    container.setDepth(SceneLevelZIndexes.dudeLevel)
    this._playerSprite = engine.add.sprite(0, this._frameResolution.height * correctSpriteOffsetY, 'dude')
    this.setPlayerSpriteFlip()
    container.scale = dudeScale
    const normalContainerSizes = {
      width: this._frameResolution.width / dudeScale,
      height: this._frameResolution.height / dudeScale,
    }
    container.setSize(normalContainerSizes.width, normalContainerSizes.height)
    container.add(this._playerSprite)
    engine.physics.world.enable(container)
    this._playerBody = container.body as Phaser.Physics.Arcade.Body
    this._playerBody.setBounce(0)
    this._playerBody.setCollideWorldBounds(true)
    this._playerBody.setGravityY(1000)


    if (this._levels.groundLayer) {
      engine.physics.add.collider(this._playerBody, this._levels.groundLayer)
    }

    this.sounds = engine.soundSystem

    // all animations for dude
    this.createAnimations(engine, keyAnimFrameSet)

    // set begin parameters for start game
    // from setters
    this.isNearLadder = false
    this.dudeMoveState = DudeStates.idle

    this._camera.startFollow(container)

    if (engine.physics.world.drawDebug) {
      this._tilePointer = engine.add.circle(0, 0, 5, 0xFF0000, 1.0)
    }

    this._progressBar = new DudeProgressBar(engine)
    this.progressBarValues = null

    this.userModals = engine.modalsSystem

    //create overlap with droppedItems for pick up them
    if (this.dropItems._group) {
      engine.physics.add.overlap(this._playerBody, this.dropItems._group,
        (prPlayer: overlapCallbackParams, prItem: overlapCallbackParams) => {
          this.overlapDudeDropItemsCallbackUpdating(
            prItem as Types.Physics.Arcade.SpriteWithDynamicBody,
          )
        })
    }
  }

  updateKyes(time: number, keys: mainKeys): void {

    this.isSpaceDown = keys.space.isDown
    this.isCtrlDow = keys.ctrl.isDown

    // when you run, you don't do anymore!
    if (this._runTimeout) return

    const doublePushKey = this.saveAndGetLastPushKey(time, keys)

    this.isLeftMove = {
      value: keys.left.isDown,
      isDouble: (doublePushKey == keys.left),
    }
    this.isRightMove = {
      value: keys.right.isDown,
      isDouble: (doublePushKey == keys.right),
    }
    this.isUpMove = {
      value: keys.up.isDown,
      isDouble: (doublePushKey == keys.up),
    }
    this.isDownMove = {
      value: keys.down.isDown,
      isDouble: (doublePushKey == keys.down),
    }
  }

  mainUpdate(time: number) {
    // set max gravity speed fall
    if (this._playerBody.velocity.y > this._maxFallSpeed) {
      this._playerBody.velocity.y = this._maxFallSpeed
    }

    const plCords = this.getTilePlayerCoords()

    if (this._tilePointer) {
      const getSize = (coord: number) => {
        return coord * this._levels.tileWidth + this._levels.tileWidth * 0.5
      }
      this._tilePointer.setPosition(getSize(plCords.x), getSize(plCords.y))
    }

    this.overlapLadders(plCords)

    this.overlapEnvElements(plCords)

    this._tips.update(time)
  }

  setXPlayerBodyForClimbing() {
    const coords = this.getTilePlayerCoords()
    this._playerBody.x = coords.x * this._levels.tileWidth
  }

  updateClimbingMovements() {
    if (this.dudeMoveState != DudeStates.climbing) return

    if (this._playerBody.x % this._levels.tileWidth > 0) {
      this.setXPlayerBodyForClimbing()
    }

    switch (this.climbingType) {
      case DudeClimbingTypes.up:
        this.dudeAnimationKey = { key: DudeAnimations.climbingUp, isIgnoreIf: true }
        this.setDudeUpDownMoveSizes(true)
        break
      case DudeClimbingTypes.down:
        this.dudeAnimationKey = { key: DudeAnimations.climbingDown, isIgnoreIf: true }
        this.setDudeUpDownMoveSizes(false)
        break
      default:
        this.dudeAnimationKey = { key: DudeAnimations.climbingStand, isIgnoreIf: true }
        this.setDydeStaySizes()
    }
  }

  // update dude state
  // change move & climp & fight states
  dudeMoveStateUpdating(newState: DudeStates) {
    if (newState == this._dudeMoveState) return false

    if (this._dudeMoveState == DudeStates.idle && newState != DudeStates.idle) {
      this._tips.hideTip()
      if (this.envCollisionElementData != null) {
        EventBus.Dispatch(BusEventsList[BusEventsList.charTwitching], this.envCollisionElementData)
      }
    }

    switch (newState) {
      case DudeStates.idle:
        this.climbingType = DudeClimbingTypes.stand
        this.dudeAnimationKey = {
          key: DudeAnimations.idle, isIgnoreIf: true
        }
        this.setDydeStaySizes()
        this.calcsForDropAvailable()
        this.sounds.stopLevelTypeSound(SoundLV.dudeMoveSounds)
        break
      case DudeStates.walk:
        this.dudeAnimationKey = {
          key: DudeAnimations.walking, isIgnoreIf: true
        }
        this.sounds.playLevelTypeSound(SoundLV.dudeMoveSounds, MoveSounds[MoveSounds.walk])
        break
      case DudeStates.run:
        this.dudeAnimationKey = {
          key: DudeAnimations.run, isIgnoreIf: true
        }
        this.sounds.playLevelTypeSound(SoundLV.dudeMoveSounds, MoveSounds[MoveSounds.run])
        break
      case DudeStates.climbing:
        this.setXPlayerBodyForClimbing()
        this._slotSystem.setDudeDropAvailable(false)
        break
      case DudeStates.fighting:
        this._slotSystem.setDudeDropAvailable(false)
    }

    return true
  }

  // function for updating left\right bottons keys
  leftRightKyesUpdating(newValue: boolean, oldValue: boolean, isDouble: boolean, isLeft: boolean) {
    if (newValue) {
      this._isFlipXAnimations = isLeft
    }

    const offset = isLeft ? (-1) : 1
    const halfWidth = this._frameResolution.width / 2
    const xOffsetForCalcCoords = isLeft ? (halfWidth - 1) : (-halfWidth)
    const plCoords = this.getTilePlayerCoords(xOffsetForCalcCoords, 0)

    const isHorMoveAvailable = (yTile: number | null = null) => {
      const yCord = (yTile == null) ? plCoords.y : yTile
      return !this._levels.isCheckSymbMapElements(CheckSymMapElements.wall, plCoords.x + offset, yCord)
    }

    const isMoveFromLadderAvailable = () => {
      const yTiles = this.getYTilesForPlayerBody()
      let isAvailable = true
      for (let i = 0; i < yTiles.length; i++) {
        if (!isHorMoveAvailable(yTiles[i])) {
          isAvailable = false
          break
        }
      }
      return isAvailable
    }

    switch (this.dudeMoveState) {
      case DudeStates.idle:
        if (newValue && isHorMoveAvailable()) {
          if (isDouble) {
            this.dudeMoveState = DudeStates.run
          } else {
            this.dudeMoveState = DudeStates.walk
          }
        }
        break
      case DudeStates.walk:
        if (newValue && isHorMoveAvailable()) {
          this.setDudeLeftRightMoveSizes(isLeft)
        } else if (oldValue) {
          this.dudeMoveState = DudeStates.idle
        }
        break
      case DudeStates.run:
        if (newValue && isHorMoveAvailable()) {
          this.setDudeLeftRightMoveSizes(isLeft, true)
        } else if (oldValue) {
          if (this._runTimeout != undefined) {
            window.clearTimeout(this._runTimeout)
          }

          this._runTimeout = window.setTimeout(() => {
            this._runTimeout = undefined
            this.dudeMoveState = DudeStates.idle
          }, 500)
        }
        break
      case DudeStates.climbing:
        if (newValue && isMoveFromLadderAvailable()) {
          this.climbingType = DudeClimbingTypes.stand
          this.dudeMoveState = DudeStates.walk
        }
        break
      case DudeStates.fighting:
    }
  }

  // up down key updaitng for move
  // don't fighting!
  upDownSimpleMoveUpdaiting(
    newValue: boolean, newClimbingType: DudeClimbingTypes.up | DudeClimbingTypes.down) {
    let yOffsetForCheckMove

    if (newClimbingType == DudeClimbingTypes.up) {
      yOffsetForCheckMove = -1
    } else {
      yOffsetForCheckMove = 1
    }

    const setClimbingSound = () => {
      this.sounds.playLevelTypeSound(SoundLV.dudeMoveSounds, MoveSounds[MoveSounds.climbing])
    }

    switch (this.dudeMoveState) {
      case DudeStates.idle:
        const plCoords = this.getTilePlayerCoords()
        if (newValue && this.isNearLadder
          && this._levels.isCheckSymbMapElements(CheckSymMapElements.ladder, plCoords.x, plCoords.y + yOffsetForCheckMove)) {
          this.climbingType = newClimbingType
          this.dudeMoveState = DudeStates.climbing
          setClimbingSound()
        }
        break
      case DudeStates.climbing:
        if (newValue) {
          if (this.climbingType == newClimbingType) {
            this.climbingType = DudeClimbingTypes.stand
            this.sounds.stopLevelTypeSound(SoundLV.dudeMoveSounds)
          } else {
            this.climbingType = newClimbingType
            setClimbingSound()
          }
        }
    }
  }

  // see overlap the dude with some stairs
  // if yes, set turn off gravity for dude and show tip
  overlapLadders(plCords: ITilesCoords) {
    if (!this._levels.ladderLayer?.getTileAt(plCords.x, plCords.y)) {
      this.isNearLadder = false
      return
    }

    switch (this.dudeMoveState) {
      case DudeStates.walk:
      case DudeStates.run:
        this.isNearLadder = true
        break
      case DudeStates.idle:
        // if near ladders and we are idle -> show tip
        // in another case hide this
        if (this.isNearLadder) {
          const iconCoords: INumberCoords = { w: this._playerBody.x, h: this._playerBody.y }
          // 39 for the icon
          const ladderTip = this._tips
          ladderTip?.showUsualTip(iconCoords, 39)
          // ladderTip?.showCombinedTip(iconCoords, {main: 39, rightBottom: 30, rightTop: 38})
        }
        break
      case DudeStates.climbing:
        const isUp = this.climbingType == DudeClimbingTypes.up
        const halfTileWidch = this._levels.tileWidth * 0.5
        const yOffsetForSpecCoords = isUp ? halfTileWidch : halfTileWidch * (-1)
        const tileCorrect = isUp ? (-1) : 1
        const specCoords = this.getTilePlayerCoords(0, yOffsetForSpecCoords)
        if (!this._levels.isCheckSymbMapElements(CheckSymMapElements.ladder, specCoords.x, specCoords.y + tileCorrect)) {
          this.dudeMoveState = DudeStates.idle
        }
    }
  }

  // updating overlaps with evn elements(torches, doors and other)
  overlapEnvElements(plCords: ITilesCoords) {
    const levels = this._levels
    const envElementTile = levels.envLayer?.getTileAt(plCords.x, plCords.y)
    if (!envElementTile) {
      this.envCollisionElementData = null
      return
    }

    const element = this._staticElementsList[
      EnvStaticMapElementTypes.GetIndexForStaticElement(String(envElementTile.index), plCords)]

    if (!element || !element.isInteractive) {
      this.envCollisionElementData = null
      return
    }

    this.envCollisionElementData = element
  }

  // active when dude has on tile with dropItem
  // cyclic!
  overlapDudeDropItemsCallbackUpdating(
    droppedItem: Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const plCrds = this.getTilePlayerCoords()
    const inTile = this.dropItems.checkItemInTile(plCrds, droppedItem.frame.name)

    if (!inTile) {
      this.pocketItemCollisionData = null
      return
    }

    if (droppedItem.active) {
      this.pocketItemCollisionData = this.dropItems.getItemDataForActiveItem(plCrds)
    }
  }


  // dude movement's & anims
  // (left, right or climbing) set sizes for movements
  setDudeLeftRightMoveSizes(isLeft: boolean, isDouble: boolean = false) {
    let offset = 90
    if (isDouble) {
      offset = offset * 4
    }

    if (isLeft) {
      this._playerBody.setVelocityX(-offset)
    } else {
      this._playerBody.setVelocityX(offset)
    }
  }
  // up, down
  setDudeUpDownMoveSizes(isUp: boolean) {
    if (isUp) {
      this._playerBody.setVelocityY(-100)
    } else {
      this._playerBody.setVelocityY(150)
    }
  }
  // stop for dude
  setDydeStaySizes() {
    this._playerBody.setVelocityX(0)
    this._playerBody.setVelocityY(0)
  }

  // get animation key for index from enums
  static getAnimKey(index: DudeAnimations) {
    return 'dude-animations-' + index
  }

  // create all availible animations for this player
  createAnimations(scene: MainEngine, animsKey: string) {
    this._playerSprite.anims.create({
      key: Dude.getAnimKey(DudeAnimations.idle),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    })

    this._playerSprite.anims.create({
      key: Dude.getAnimKey(DudeAnimations.walking),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 88, end: 97 }),
      frameRate: 15,
      repeat: -1
    })

    this._playerSprite.anims.create({
      key: Dude.getAnimKey(DudeAnimations.run),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 16, end: 23 }),
      frameRate: 15,
      repeat: -1,
    })

    this._playerSprite.anims.create({
      key: Dude.getAnimKey(DudeAnimations.climbingUp),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 128, end: 137 }),
      frameRate: 15,
      repeat: -1,
    })

    this._playerSprite.anims.create({
      key: Dude.getAnimKey(DudeAnimations.climbingDown),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 137, end: 128 }),
      frameRate: 15,
      repeat: -1,
    })

    this._playerSprite.anims.create({
      key: Dude.getAnimKey(DudeAnimations.climbingStand),
      frames: [{ key: animsKey, frame: 128 }],
    })
  }


  // get Coords with correction from texture scale
  getTilePlayerCoords(xOffset: number = 0, yOffset: number = 0): ITilesCoords {

    const xSizeWithCorrects = this._playerBody.x + (this._frameResolution.width * 0.5) + xOffset
    const ySizeWithCorrects = this._playerBody.y + (this._frameResolution.height * 0.725) + yOffset
    const coords =
      this._levels.getTilesForCoords(xSizeWithCorrects, ySizeWithCorrects)

    return { x: coords.x, y: coords.y }
  }

  getYTilesForPlayerBody() {
    const playerY = this._playerBody.y
    const tileWidth = this._levels.tileWidth
    const playerHeight = this._frameResolution.height

    const tileIdUp = Math.floor(playerY / tileWidth)

    const upNumTilesForPlayer = Math.ceil(playerHeight / tileWidth)
    let tileCountForPlayer = upNumTilesForPlayer

    if (playerY % tileWidth > upNumTilesForPlayer * tileWidth - playerHeight) {
      tileCountForPlayer++
    }

    const numsArray: number[] = []
    for (let i = 0; i < tileCountForPlayer; i++) {
      numsArray.push(tileIdUp + i)
    }

    return numsArray
  }

  // save lust push key
  // search double pushed keys
  saveAndGetLastPushKey(
    time: number, keys: mainKeys): Phaser.Input.Keyboard.Key | null {
    let pushedKey: Phaser.Input.Keyboard.Key | null = null

    const isDoublePushKey = (k: Phaser.Input.Keyboard.Key): Phaser.Input.Keyboard.Key | null => {
      if (k != this._lastTapKey.key) {
        return null
      }

      if (k.getDuration() >= this._lastTapKey.duration) {
        return null
      }

      const lastTapeTime = this._lastTapKey.time
      const isTime = 200 >= time - lastTapeTime
      return isTime ? k : null
    }

    const setTapKey = (k: Phaser.Input.Keyboard.Key) => {
      this._lastTapKey = { time, key: k, duration: k.getDuration() }
    }

    if (keys.left.isDown) {
      pushedKey = isDoublePushKey(keys.left)
      setTapKey(keys.left)
    } else if (keys.right.isDown) {
      pushedKey = isDoublePushKey(keys.right)
      setTapKey(keys.right)
    } else if (keys.up.isDown) {
      pushedKey = isDoublePushKey(keys.up)
      setTapKey(keys.up)
    } else if (keys.down.isDown) {
      pushedKey = isDoublePushKey(keys.down)
      setTapKey(keys.down)
    }

    return pushedKey
  }

  itarateThings() {
    if (this.pocketItemCollisionData != null && this.pocketItemCollisionData.cycled) {
      this.dropItems.itaratePileItems(this.pocketItemCollisionData.coords)
    }
  }

  showPickupItemTip(data: PocketItemDudeData) {
    if (data == null) {
      this._tips.hideTip()
      return
    }
    // 38 - arrows, hand - 21
    const combSprites: ISpriteNumsForCombinedTip = {
      main: (+data.type),
      rightBottom: PocketItemsEnum.hand,
      rightTop: undefined
    }
    if (data.cycled) combSprites.rightTop = 38

    const pos = IconTips.GetTipPos(data.coords, this._levels.tileWidth)
    this._tips.showCombinedTip(pos, combSprites)
  }

  calcsForDropAvailable() {
    const selectedItem = this._slotSystem.selectedItem
    if (selectedItem && selectedItem.isDropped) {
      const idleCoords = this.getTilePlayerCoords()
      const isPlaceble = (this.dropItems.findPlaceForItem(idleCoords) != null)
      this._slotSystem.setDudeDropAvailable(isPlaceble)
    }
  }

  setPlayerSpriteFlip() {
    this._playerSprite.setFlipX(this._isFlipXAnimations)
    if (this._isFlipXAnimations) {
      this._playerSprite.setX(0)
    } else {
      // fuck magic
      this._playerSprite.setX(1)
    }
  }

  showEnvElementTip(elData: EnvElementNullData) {
    if (elData == null) {
      this._tips.hideTip()
      return
    }

    const combSprites: ISpriteNumsForCombinedTip = {
      main: elData.iconTip,
      rightBottom: elData.toolType,
      rightTop: undefined
    }

    const pos = IconTips.GetTipPos(this.getTilePlayerCoords(), this._levels.tileWidth)
    this._tips.showCombinedTip(pos, combSprites)
  }

  updateProgressBar() {
    if (this.progressBarValues == null) {
      this._progressBar.drawData = null
      return
    }

    const coords = this.getTilePlayerCoords()
    const position: INumberCoords = {
      w: (coords.x + 0.5) * this._levels.tileWidth,
      h: (coords.y + 1.7) * this._levels.tileWidth,
    }

    this._progressBar.drawData = {
      position,
      type: this.progressBarValues.type,
      progress: this.progressBarValues.progress,
    }
  }
}
