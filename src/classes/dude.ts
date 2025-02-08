import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'

import {
  IResolution,
  INumberCoords,
  mainKeys,
  IconTips,
} from '@/types/main-types'
import { DudeClimbingTypes, DudeStates } from '@/types/enums'

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

  //@ts-ignore // isDudeState
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

  // isLeft
  private _isLeftMove: boolean = false
  public set isLeftMove(value: boolean) {
    this.leftRightKyesUpdating(value, this._isLeftMove, true)
    this._isLeftMove = value
  }
  public get isLeftMove(): boolean {
    return this._isLeftMove
  }
  //

  // isRightMove
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

  constructor(
    engine: MainEngine, mapLevels: MapSceneLevels, camera: SceneCamera, tips: IconTips, frameResolution: IResolution) {

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

    this.isNearStairs = false
    this.dudeMoveState = DudeStates.walk

    if (this._levels.groundLayer) {
      engine.physics.add.collider(this.player, this._levels.groundLayer)
    }

    this.player.anims.create({
      key: 'leftDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.player.anims.create({
      key: 'turnDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
      frameRate: 1,
      repeat: -1
    })

    this.player.anims.create({
      key: 'rightDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
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
      case DudeStates.walk:
        this.isNearStairs = false
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
      case DudeStates.walk:
        if (newValue) {
          this.setDudeLeftRightMoveSizes(isLeft)
        } else if (oldValue) {
          this.setDydeStaySizes()
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
      this.player.setVelocityX(-160)
      this.player.anims.play('leftDude', true)
    } else {
      this.player.setVelocityX(160)
      this.player.anims.play('rightDude', true)
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
    switch (this.dudeMoveState) {
      case DudeStates.walk:
        this.player.anims.play('turnDude', true)
        break
      case DudeStates.climbing:
    }
    this.player.setVelocityX(0)
    this.player.setVelocityY(0)
  }
}
