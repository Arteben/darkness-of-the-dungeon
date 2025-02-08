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
} from '@/types/main-types'

import {
  DudeClimbingTypes,
  DudeStates,
  DudeAnimations,
} from '@/types/enums'

export class Dude {
  player: Types.Physics.Arcade.SpriteWithDynamicBody
  _dudeStay: boolean = true
  _frame: IResolution
  _levels: MapSceneLevels
  _camera: SceneCamera
  _tips: IconTips

  // @ts-ignore // isNearStairs
  private _isNearStairs: boolean
  public set isNearStairs(flag: boolean) {
    if (flag == this._isNearStairs) return

    if (flag) {
      this.player.body.setGravityY(0)
    } else {
      this.player.body.setGravityY(1000)
    }
    this.player.body.setAllowGravity(!flag)
    this._isNearStairs = flag
  }
  public get isNearStairs(): boolean {
    return this._isNearStairs
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
  public set isLeftMove(value: boolean) {
    this.leftRightKyesUpdating(value, this._isLeftMove, true)
    this._isLeftMove = value
  }
  public get isLeftMove(): boolean {
    return this._isLeftMove
  }
  //

  // isRightKeys
  private _isRightMove: boolean = false
  public set isRightMove(value: boolean) {
    this.leftRightKyesUpdating(value, this._isRightMove, false)
    this._isRightMove = value
  }
  public get isRightMove(): boolean {
    return this._isRightMove
  }
  //

  // isUpKye
  private _isUpMove: boolean = false
  public set isUpMove(value: boolean) {
    if (value == this._isUpMove) return

    switch (this.dudeMoveState) {
      case DudeStates.walk:
        if (value && this.isNearStairs) {
          this.climbingType = DudeClimbingTypes.up
          this.dudeMoveState = DudeStates.climbing
        }
        break
      case DudeStates.climbing:
        if (this.climbingType != DudeClimbingTypes.up) {
          this.climbingType = DudeClimbingTypes.up
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
  public set isDownMove(value: boolean) {
    if (value == this._isDownMove) return

    switch (this.dudeMoveState) {
      case DudeStates.walk:
        if (value && this.isNearStairs) {
          this.climbingType = DudeClimbingTypes.down
          this.dudeMoveState = DudeStates.climbing
        }
        break
      case DudeStates.climbing:
        if (this.climbingType != DudeClimbingTypes.down) {
          this.climbingType = DudeClimbingTypes.down
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
        this.player.setFlipX(this.isFlipXAnimations)
    }
    this.player.anims.play(Dude.getAnimKey(key), isIgnoreIf)
    this._dudeAnimationKey = key
  }
  public get dudeAnimationKey(): DudeAnimations {
    return this._dudeAnimationKey
  }
  //

  // flip animation for left | right animations
  isFlipXAnimations: boolean = false

  // CONSTRUCTOR ~180
  constructor(
    engine: MainEngine, mapLevels: MapSceneLevels, camera: SceneCamera,
    tips: IconTips, keyAnimFrameSet: string, frameResolution: IResolution) {

    this._levels = mapLevels
    this._camera = camera
    this._tips = tips

    // set animation frame size for our levels
    const dudeScale = 1.6
    const animFrameSize = 56

    this._frame = {
      width: frameResolution.width / dudeScale,
      height: frameResolution.height / dudeScale,
    }

    const startMapCoords = this._levels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h
    }

    this.player = engine.physics.add.sprite(startCoords.w, startCoords.h, 'dude')
    this.player.setBounce(0)
    this.player.setCollideWorldBounds(true)
    this.player.setScale(dudeScale)

    this.player.body.setSize(this._frame.width, this._frame.height)
    this.player.setOffset((animFrameSize - this._frame.width) / 2,
      animFrameSize - this._frame.height)

    if (this._levels.groundLayer) {
      engine.physics.add.collider(this.player, this._levels.groundLayer)
    }

    // all animations for dude
    this.createAnimations(engine, keyAnimFrameSet)

    // set start parameters for start game
    this.isNearStairs = false
    this.dudeMoveState = DudeStates.idle
  }

  update(keys: mainKeys): void {
    this._camera.isZooming = keys.space.isDown
    if (keys.space.isDown) {
      return
    }

    this.isLeftMove = keys.left.isDown
    this.isRightMove = keys.right.isDown

    this.isUpMove = keys.up.isDown
    this.isDownMove = keys.down.isDown


    if (this.dudeMoveState == DudeStates.climbing) {
      switch (this.climbingType) {
        case DudeClimbingTypes.up:
          this.setDudeUpDownMoveSizes(true)
          break
        case DudeClimbingTypes.down:
          this.setDudeUpDownMoveSizes(false)
          break
        default:
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
        this.isNearStairs = false
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
      case DudeStates.climbing:
        this._tips.stairsTip?.setIcon(false, null)
        this.isNearStairs = true
        const dude = this.player
        const coords = this._levels.getTilesForCoords(dude.x, dude.y)
        dude.x = (coords.x + 0.5) * this._levels._tileWidth
        break
      case DudeStates.fighting:
        this.isNearStairs = false
    }

    this._dudeMoveState = newState
  }

  // function for updating left\right bottons keys
  leftRightKyesUpdating(newValue: boolean, oldValue: boolean, isLeft: boolean) {
    switch (this.dudeMoveState) {
      case DudeStates.idle:
        if (newValue) {
          this.isFlipXAnimations = isLeft
          this.dudeMoveState = DudeStates.walk
          this.setDudeLeftRightMoveSizes(isLeft)
        }
        break
      case DudeStates.walk:
        if (newValue) {
          this.isFlipXAnimations = isLeft
          this.setDudeLeftRightMoveSizes(isLeft)
        } else if (oldValue) {
          this.dudeMoveState = DudeStates.idle
        }
        break
      case DudeStates.climbing:
        if (newValue) {
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
    dude: Phaser.Physics.Arcade.Body, tile: Phaser.Tilemaps.Tile) {
    const levels = this._levels
    const coords = levels.getTilesForCoords(dude.x, dude.y)
    const stairsTip = this._tips.stairsTip || null
    // dude is very tall and his center is upper
    // to do set in function
    if (!(tile.x == coords.x && tile.y == coords.y + 1)) return


    this.isNearStairs = tile.index != -1

    if (!this.isNearStairs) {
      stairsTip?.setIcon(false, null)
      if (this.dudeMoveState == DudeStates.climbing
        && this.climbingType != DudeClimbingTypes.stand) {
        this.climbingType = DudeClimbingTypes.stand
      }
    } else if (this.dudeMoveState == DudeStates.walk) {
      const iconCoords: INumberCoords = { w: dude.x, h: dude.y }
      stairsTip?.setIcon(true, iconCoords)
    }
  }


  // dude movement's & anims
  // (left, right or climbing) set sizes for movements
  setDudeLeftRightMoveSizes(isLeft: boolean) {
    if (isLeft) {
      this.player.setVelocityX(-90)
    } else {
      this.player.setVelocityX(90)
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

    // this.player.anims.create({
    //   key: 'rightDude',
    //   frames: scene.anims.generateFrameNumbers(animsKey, { start: 5, end: 8 }),
    //   frameRate: 10,
    //   repeat: -1
    // })
  }
}
