import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'

import {
  IResolution,
  INumberCoords,
  mainKeys,
  IconTips,
  IAnimDudePlayParams,
  ITilesCoords,
  ILastUserPushKye,
  IPushKeysParams,
} from '@/types/main-types'

import {
  DudeClimbingTypes,
  DudeStates,
  DudeAnimations,
  CheckSymMapElements,
} from '@/types/enums'

export class Dude {
  player: Types.Physics.Arcade.SpriteWithDynamicBody
  _dudeStay: boolean = true
  _frame: IResolution
  _levels: MapSceneLevels
  _camera: SceneCamera
  _tips: IconTips

  // @ts-ignore // isNearLadder
  private _isNearLadder: boolean
  public set isNearLadder(flag: boolean) {
    if (flag == this._isNearLadder) return

    if (flag) {
      this.player.body.setGravityY(0)
    } else {
      this.player.body.setGravityY(1000)
    }
    this.player.body.setAllowGravity(!flag)
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
        this.player.setFlipX(this._isFlipXAnimations)
    }
    this.player.anims.play(Dude.getAnimKey(key), isIgnoreIf)
    this._dudeAnimationKey = key
  }
  public get dudeAnimationKey(): DudeAnimations {
    return this._dudeAnimationKey
  }
  //

  // flip animation for left | right animations
  _isFlipXAnimations: boolean = false

  _lastTapKey: ILastUserPushKye = {
    duration: 0,
    key: null,
    time: 0,
  }

  // CONSTRUCTOR ~180
  constructor(
    engine: MainEngine, mapLevels: MapSceneLevels, camera: SceneCamera,
    tips: IconTips, keyAnimFrameSet: string, frameResolution: IResolution) {

    this._levels = mapLevels
    this._camera = camera
    this._tips = tips

    // set animation frame size for our levels
    // magic numbers
    const dudeScale = 1.6
    const animFrameSize = 56
    const originY = 0.65

    this._frame = {
      width: frameResolution.width / dudeScale,
      height: frameResolution.height / dudeScale,
    }

    const startMapCoords = this._levels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h - this._frame.height
    }

    this.player = engine.physics.add.sprite(startCoords.w, startCoords.h, 'dude')
    this.player.setBounce(0)
    this.player.setCollideWorldBounds(true)
    this.player.setScale(dudeScale)
    this.player.setOrigin(0.5, originY)

    this.player.body.setSize(this._frame.width, this._frame.height)

    this.player.setOffset((animFrameSize - this._frame.width) / 2, animFrameSize - this._frame.height)

    if (this._levels.groundLayer) {
      engine.physics.add.collider(this.player, this._levels.groundLayer)
    }

    // all animations for dude
    this.createAnimations(engine, keyAnimFrameSet)

    // set begin parameters for start game
    // from setters
    this.isNearLadder = false
    this.dudeMoveState = DudeStates.idle
  }

  update(time: number, keys: mainKeys): void {
    this._camera.isZooming = keys.space.isDown
    if (keys.space.isDown) {
      return
    }

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
        break
      case DudeStates.walk:
        this.dudeAnimationKey = {
          key: DudeAnimations.walking, isIgnoreIf: true
        }
        break
      case DudeStates.run:
        this.dudeAnimationKey = {
          key: DudeAnimations.run, isIgnoreIf: true
        }
        break
      case DudeStates.climbing:
        this.isNearLadder = true
        this._tips.stairsTip?.setIcon(false, null)
        const coords = this.getTilePlayerCoords()
        this.player.x = (coords.x + 0.5) * this._levels._tileWidth
        break
      case DudeStates.fighting:
        this.isNearLadder = false
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
  overlapCallbackUpdating(
    dude: Types.Physics.Arcade.GameObjectWithBody, tile: Phaser.Tilemaps.Tile) {
    const plCrds = this.getTilePlayerCoords()
    const stairsTip = this._tips.stairsTip || null

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
      const iconCoords: INumberCoords = { w: dude.body.x, h: dude.body.y }
      stairsTip?.setIcon(true, iconCoords)
    } else {
      stairsTip?.setIcon(false, null)
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


  // dude movement's & anims
  // (left, right or climbing) set sizes for movements
  setDudeLeftRightMoveSizes(isLeft: boolean, isDouble: boolean = false) {
    let offset = 90
    if (isDouble) {
      offset = offset * 2
    }

    if (isLeft) {
      this.player.setVelocityX(-offset)
    } else {
      this.player.setVelocityX(offset)
    }
  }
  // up, down
  setDudeUpDownMoveSizes(isUp: boolean) {
    if (isUp) {
      this.player.setVelocityY(-100)
    } else {
      this.player.setVelocityY(110)
    }
  }
  // stop for dude
  setDydeStaySizes() {
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
  }

  // get animation key for index from enums
  static getAnimKey(index: DudeAnimations) {
    return 'dude-animations-' + index
  }

  // create all availible animations for this player
  createAnimations(scene: MainEngine, animsKey: string) {
    this.player.anims.create({
      key: Dude.getAnimKey(DudeAnimations.idle),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 0, end: 2 }),
      frameRate: 2,
      repeat: -1
    })

    this.player.anims.create({
      key: Dude.getAnimKey(DudeAnimations.walking),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 88, end: 97 }),
      frameRate: 14,
      repeat: -1
    })

    this.player.anims.create({
      key: Dude.getAnimKey(DudeAnimations.run),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 16, end: 23 }),
      frameRate: 15,
      repeat: -1,
    })

    this.player.anims.create({
      key: Dude.getAnimKey(DudeAnimations.climbingUp),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 128, end: 137 }),
      frameRate: 15,
      repeat: -1,
    })

    this.player.anims.create({
      key: Dude.getAnimKey(DudeAnimations.climbingDown),
      frames: scene.anims.generateFrameNumbers(animsKey, { start: 137, end: 128 }),
      frameRate: 15,
      repeat: -1,
    })

    this.player.anims.create({
      key: Dude.getAnimKey(DudeAnimations.climbingStand),
      frames: [{ key: animsKey, frame: 128 }],
    })
  }


  // get Coords with correction from texture scale
  getTilePlayerCoords(offsetX: number = 0, offsetY: number = 0): ITilesCoords {
    const coords =
      this._levels.getTilesForCoords(this.player.x + offsetX, this.player.y + offsetY)
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
}
