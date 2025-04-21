import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'
import { DroppedItemsSystem as DropItems, DroppedItemsSystem } from '@/classes/dropped-items-system'
import { IconTips } from '@/classes/icon-tips'
import { PocketSlotsSystem } from '@/classes/pocket-slots-system'
import { PocketItem } from '@/classes/pocket-item'

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
} from '@/types/main-types'

import {
  DudeClimbingTypes,
  DudeStates,
  DudeAnimations,
  CheckSymMapElements,
} from '@/types/enums'

export class Dude {
  _container: Types.Physics.Arcade.GameObjectWithDynamicBody
  // _player: Types.Physics.Arcade.SpriteWithDynamicBody
  _playerSprite: GameObjects.Sprite
  _dudeStay: boolean = true
  _frame: IResolution
  _levels: MapSceneLevels
  _camera: SceneCamera
  _tips: IconTips
  _dropItems: DroppedItemsSystem
  _slotSystem: PocketSlotsSystem

  // @ts-ignore // isNearLadder
  private _isNearLadder: boolean
  public set isNearLadder(flag: boolean) {
    if (flag == this._isNearLadder) return

    if (flag) {
      this._container.body.setGravityY(0)
    } else {
      this._container.body.setGravityY(1000)
    }
    this._container.body.setAllowGravity(!flag)
    this._isNearLadder = flag
  }
  public get isNearLadder(): boolean {
    return this._isNearLadder
  }
  //

  // @ts-ignore // isDudeState
  private _dudeMoveState: DudeStates
  public set dudeMoveState(newState: DudeStates) {
    this.dudeMoveStateUpdating(newState)
  }
  public get dudeMoveState(): DudeStates {
    return this._dudeMoveState
  }

  // climbing up OR down here?
  private _climbingType: DudeClimbingTypes = DudeClimbingTypes.stand
  public set climbingType(newValue: DudeClimbingTypes) {
    if (newValue == this._climbingType) return

    switch (newValue) {
      case DudeClimbingTypes.up:
        this._camera.setUpDownOffset(true)
        break
      case DudeClimbingTypes.down:
        this._camera.setUpDownOffset(false)
        break
      case DudeClimbingTypes.stand:
        this._camera.setStandartOffset()
    }

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

    switch (this.dudeMoveState) {
      case DudeStates.idle:
        const plCoords = this.getTilePlayerCoords()
        if (value && this.isNearLadder
          && this._levels.isCheckSymbMapElements(CheckSymMapElements.ladder, plCoords.x, plCoords.y - 1)) {
          this.climbingType = DudeClimbingTypes.up
          this.dudeMoveState = DudeStates.climbing
        }
        break
      case DudeStates.climbing:
        if (value) {
          if (this.climbingType != DudeClimbingTypes.up) {
            if (this.climbingType == DudeClimbingTypes.down) {
              this.climbingType = DudeClimbingTypes.stand
            } else {
              this.climbingType = DudeClimbingTypes.up
            }
          }
        }
        break
      case DudeStates.fighting:
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

    switch (this.dudeMoveState) {
      case DudeStates.idle:
        const plCoords = this.getTilePlayerCoords()
        if (value && this.isNearLadder
          && this._levels.isCheckSymbMapElements(CheckSymMapElements.ladder, plCoords.x, plCoords.y + 1)) {
          this.climbingType = DudeClimbingTypes.down
          this.dudeMoveState = DudeStates.climbing
        }
        break
      case DudeStates.climbing:
        if (value) {
          if (this.climbingType != DudeClimbingTypes.down) {
            if (this.climbingType == DudeClimbingTypes.up) {
              this.climbingType = DudeClimbingTypes.stand
            } else {
              this.climbingType = DudeClimbingTypes.down
            }
          }
        }
        break
      case DudeStates.fighting:
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
        this._playerSprite.setFlipX(this._isFlipXAnimations)
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
        this.usePocketItem(selectedItem)
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
  private _overlapSomeItem: PocketItemDudeData = null
  public set overlapSomeItem(droppedItemData: PocketItemDudeData) {
    if (droppedItemData != null && this._slotSystem.isFullSlots()) {
      droppedItemData = null
    }
    this._overlapSomeItem = droppedItemData
    this.showPickupItemTip(droppedItemData)
  }
  public get overlapSomeItem(): PocketItemDudeData {
    return this._overlapSomeItem
  }
  //

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
    slotSystem: PocketSlotsSystem,
    keyAnimFrameSet: string, frameResolution: IResolution) {

    this._levels = mapLevels
    this._camera = camera
    this._dropItems = dropItems
    this._tips = tips
    this._slotSystem = slotSystem
    // set function for drop elements
    this._slotSystem.dropFunc = (item: PocketItem) => {
      const plCrds = this.getTilePlayerCoords()
      return this._dropItems.drop(plCrds, item)
    }
    this._slotSystem.useFunc = (item: PocketItem) => {
      this.usePocketItem(item)
    }
    this._slotSystem.calcAvailableDrop = () => {
      this.calcsForDropAvailable()
    }

    // set animation frame size for our levels
    // magic numbers
    const dudeScale = 1.6
    const spriteOffsetY = - frameResolution.height / 2.5

    this._frame = {
      width: frameResolution.width / dudeScale,
      height: frameResolution.height,
    }

    const startMapCoords = this._levels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h - this._frame.height
    }

    this._playerSprite = engine.add.sprite(0, spriteOffsetY, 'dude')

    const container = engine.add.container(startCoords.w, startCoords.h, [ this._playerSprite ])
    container.scale = dudeScale
    container.setSize(this._frame.width, this._frame.height)
    engine.physics.world.enable(container)
    this._container = container as Types.Physics.Arcade.GameObjectWithDynamicBody
    this._container.body.setBounce(0)
    this._container.body.setCollideWorldBounds(true)


    if (this._levels.groundLayer) {
      engine.physics.add.collider(this._container, this._levels.groundLayer)
    }

    // all animations for dude
    this.createAnimations(engine, keyAnimFrameSet)

    // set begin parameters for start game
    // from setters
    this.isNearLadder = false
    this.dudeMoveState = DudeStates.idle

    this._camera.startFollow(this._container)

    // create overlap dude with stairs for vertical movements
    if (this._levels.stairsLayer) {
      engine.physics.add.overlap(this._container, this._levels.stairsLayer,
        (prPlayer: overlapCallbackParams, prTile: overlapCallbackParams) => {
          this.overlapDudeLaddersCallbackUpdating(prTile as Phaser.Tilemaps.Tile)
        })
    }
    //

    //create overlap with droppedItems for pick up them
    if (this._dropItems._group) {
      engine.physics.add.overlap(this._container, this._dropItems._group,
        (prPlayer: overlapCallbackParams, prItem: overlapCallbackParams) => {
          this.overlapDudeDropItemsCallbackUpdating(
            prItem as Types.Physics.Arcade.SpriteWithDynamicBody,
          )
        })
    }
  }

  updateKyes(time: number, keys: mainKeys): void {
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

    this.isSpaceDown = keys.space.isDown
    this.isCtrlDow = keys.ctrl.isDown

    if (this.dudeMoveState == DudeStates.climbing) {
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
  }

  updateTips(time: number) {
    this._tips.update(time)
  }

  // update dude state
  // change move & climp & fight states
  dudeMoveStateUpdating(newState: DudeStates) {
    if (newState == this._dudeMoveState) return

    switch (newState) {
      case DudeStates.idle:
        this.climbingType = DudeClimbingTypes.stand
        this.dudeAnimationKey = {
          key: DudeAnimations.idle, isIgnoreIf: true
        }
        this.setDydeStaySizes()
        this.calcsForDropAvailable()
        break
      case DudeStates.walk:
        this._tips.hideTip()
        this.dudeAnimationKey = {
          key: DudeAnimations.walking, isIgnoreIf: true
        }
        break
      case DudeStates.run:
        this._tips.hideTip()
        this.dudeAnimationKey = {
          key: DudeAnimations.run, isIgnoreIf: true
        }
        break
      case DudeStates.climbing:
        this._tips.hideTip()
        this.isNearLadder = true
        const coords = this.getTilePlayerCoords()
        this._container.body.x = coords.x * this._levels.tileWidth
        this._slotSystem.setDudeDropAvailable(false)
        break
      case DudeStates.fighting:
        this._tips.hideTip()
        this.isNearLadder = false
        this._slotSystem.setDudeDropAvailable(false)
    }

    this._dudeMoveState = newState
  }

  // function for updating left\right bottons keys
  leftRightKyesUpdating(newValue: boolean, oldValue: boolean, isDouble: boolean, isLeft: boolean) {
    if (newValue) {
      this._isFlipXAnimations = isLeft
    }

    const offset = isLeft ? (-1) : 1
    // magic numbers
    const halfWidth = this._frame.width / 2
    const xOffset = isLeft ? halfWidth : -halfWidth
    const plCoords = this.getTilePlayerCoords(xOffset, 0)

    const isHorMoveAvailable = () => {
      return !this._levels.isCheckSymbMapElements(CheckSymMapElements.wall, plCoords.x + offset, plCoords.y)
    }

    switch (this.dudeMoveState) {
      case DudeStates.idle:
        if (newValue && !this._levels.isCheckSymbMapElements(CheckSymMapElements.wall, plCoords.x + offset, plCoords.y)) {
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
          this.dudeMoveState = DudeStates.idle
        }
        break
      case DudeStates.climbing:
        if (newValue && isHorMoveAvailable()) {
          this.climbingType = DudeClimbingTypes.stand
          this.dudeMoveState = DudeStates.walk
        }
        break
      case DudeStates.fighting:
    }
  }


  // see overlap the dude with some stairs
  // if yes, set turn off gravity for dude and show tip
  overlapDudeLaddersCallbackUpdating(
    tile: Phaser.Tilemaps.Tile) {
    const plCrds = this.getTilePlayerCoords()
    const ladderTip = this._tips

    // is some horizontal movement in here
    // walk, run or something else
    const isHorizMove = () => {
      return this.dudeMoveState == DudeStates.walk
        || this.dudeMoveState == DudeStates.run
    }

    if (!(tile.x == plCrds.x && tile.y == plCrds.y)) return

    if (isHorizMove()) {
      this.isNearLadder = tile.index != -1
    }

    // if near ladders and we are idle -> show tip
    // in another case hide this
    if (this.isNearLadder && this.dudeMoveState == DudeStates.idle) {
      const iconCoords: INumberCoords = { w: this._container.body.x, h: this._container.body.y }
      // 39 for the icon
      ladderTip?.showUsualTip(iconCoords, 39)
      // ladderTip?.showCombinedTip(iconCoords, {main: 39, rightBottom: 30, rightTop: 38})
    }

    if (this.dudeMoveState == DudeStates.climbing) {
      if (this.climbingType == DudeClimbingTypes.up
        && !this._levels.isCheckSymbMapElements(CheckSymMapElements.ladder, plCrds.x, plCrds.y)) {
        this.dudeMoveState = DudeStates.idle
      }

      if (this.climbingType == DudeClimbingTypes.down
        && this._levels.isCheckSymbMapElements(CheckSymMapElements.wall, plCrds.x, plCrds.y + 1)) {
        this.dudeMoveState = DudeStates.idle
      }
    }
  }

  // active when dude has on tile with dropItem
  // cyclic!
  overlapDudeDropItemsCallbackUpdating(
    droppedItem: Types.Physics.Arcade.SpriteWithDynamicBody,
  ) {
    const plCrds = this.getTilePlayerCoords()
    const inTile = this._dropItems.checkItemInTile(plCrds, droppedItem.frame.name)

    if (!inTile) {
      this.overlapSomeItem = null
      return
    }

    if (droppedItem.active) {
      this.overlapSomeItem = this._dropItems.getItemDataForActiveItem(plCrds)
    }
  }


  // dude movement's & anims
  // (left, right or climbing) set sizes for movements
  setDudeLeftRightMoveSizes(isLeft: boolean, isDouble: boolean = false) {
    let offset = 110
    if (isDouble) {
      offset = offset * 2
    }

    if (isLeft) {
      this._container.body.setVelocityX(-offset)
    } else {
      this._container.body.setVelocityX(offset)
    }
  }
  // up, down
  setDudeUpDownMoveSizes(isUp: boolean) {
    if (isUp) {
      this._container.body.setVelocityY(-100)
    } else {
      this._container.body.setVelocityY(110)
    }
  }
  // stop for dude
  setDydeStaySizes() {
    this._container.body.setVelocityX(0)
    this._container.body.setVelocityY(0)
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
      frameRate: 14,
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
  getTilePlayerCoords(offsetX: number = 0, offsetY: number = 0): ITilesCoords {
    const coords =
      this._levels.getTilesForCoords(this._container.body.x + offsetX, this._container.body.y + offsetY)
    // console.log('player coords', coords.x, coords.y)
    return { x: coords.x, y: coords.y }
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

  usePocketItem(item: PocketItem) {
    if (item == null) {
      console.error('dont find item for selected item(for call use function)!')
    } else {
      item.use(this)
    }
  }

  itarateThings() {
    if (this.overlapSomeItem != null && this.overlapSomeItem.cycled) {
      this._dropItems.itaratePileItems(this.overlapSomeItem.coords)
    }
  }

  showPickupItemTip(data: PocketItemDudeData) {
    if (data == null) {
      this._tips.hideTip()
      return
    }
    // 38 - arrows, hand - 21
    const combSprites: ISpriteNumsForCombinedTip =
      { main: (+data.type), rightBottom: 21, rightTop: undefined }
    if (data.cycled) combSprites.rightTop = 38

    const pos = {
      w: (data.coords.x + 0.5) * this._levels.tileWidth,
      h: (data.coords.y + 0.5) * this._levels.tileWidth,
    }
    this._tips.showCombinedTip(pos, combSprites)
  }

  calcsForDropAvailable () {
    const selectedItem = this._slotSystem.selectedItem
    if (selectedItem && selectedItem.isDropped) {
      const idleCoords = this.getTilePlayerCoords()
      const isPlaceble = (this._dropItems.findPlaceForItem(idleCoords) != null)
      this._slotSystem.setDudeDropAvailable(isPlaceble)
    }
  }
}
