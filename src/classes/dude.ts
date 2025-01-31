import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'
import { IconTip } from '@/classes/icon-tip'

import {
  IResolution,
  INumberCoords,
  mainKeys,
  IconTips,
} from '@/types/main-types'
import { DudeStates } from '@/types/enums'

export class Dude {
  image: Types.Physics.Arcade.SpriteWithDynamicBody
  _dudeStay: boolean = true
  _frame: IResolution
  _levels: MapSceneLevels
  _camera: SceneCamera
  _tips: IconTips

  // @ts-ignore // isNearStairs
  private _isNearStairs: boolean
  public set isNearStairs(value: boolean) {
    this.setIsNearStairs(value)
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
  _isClimbingUp: boolean = true

  // isLeft
  private _isLeftMove: boolean = false
  public set isLeftMove(value: boolean) {
    switch (this.dudeMoveState) {
      case DudeStates.walk:
        if (value) {
          this.dudeMovementUpdating(true)
        } else if (this._isLeftMove) {
          this.dudeStayUpdating()
        }
        break
      case DudeStates.climbing:
        if (value) {
          this.dudeMoveState = DudeStates.walk
        }
        break
      case DudeStates.fighting:
    }
    this._isLeftMove = value
  }
  public get isLeftMove(): boolean {
    return this._isLeftMove
  }
  //

  // isRightMove
  private _isRightMove: boolean = false
  public set isRightMove(value: boolean) {
    switch (this.dudeMoveState) {
      case DudeStates.walk:
        if (value) {
          this.dudeMovementUpdating(false)
        } else if (this._isRightMove) {
          this.dudeStayUpdating()
        }
        break
      case DudeStates.climbing:
        if (value) {
          this.dudeMoveState = DudeStates.walk
        }
        break
      case DudeStates.fighting:
    }
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
          this.dudeMoveState = DudeStates.climbing
          this._isClimbingUp = true
        }
        break
      case DudeStates.climbing:
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
    switch (this.dudeMoveState) {
      case DudeStates.walk:
        if (value && this.isNearStairs) {
          this.dudeMoveState = DudeStates.climbing
          this._isClimbingUp = false
        }
        break
      case DudeStates.climbing:
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

    this._frame = frameResolution
    this._levels = mapLevels
    this._camera = camera
    this._tips = tips

    const startMapCoords = this._levels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h
    }

    this.image = engine.physics.add.sprite(startCoords.w, startCoords.h, 'dude')
    this.image.setBounce(0)
    this.image.setCollideWorldBounds(true)
    this.isNearStairs = false
    this.dudeMoveState = DudeStates.walk

    if (this._levels.groundLayer) {
      engine.physics.add.collider(this.image, this._levels.groundLayer)
    }

    this.image.anims.create({
      key: 'leftDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.image.anims.create({
      key: 'turnDude',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    this.image.anims.create({
      key: 'rightDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
  }

  update(keys: mainKeys): void {
    this._camera.isZooming = keys.shift.isDown
    if (keys.shift.isDown) {
      return
    }

    this.isLeftMove = keys.left.isDown
    this.isRightMove = keys.right.isDown

    this.isUpMove = keys.up.isDown
    this.isDownMove = keys.down.isDown

    this.stickyClimbing()
  }

  private setIsNearStairs(flag: boolean) {
    if (flag == this._isNearStairs)
      return

    if (!flag) {
      this.image.body.setGravityY(1000)
    } else {
      this.image.body.setGravityY(0)
    }
    this._isNearStairs = flag
    this.image.body.setAllowGravity(!flag)
  }

  updateOverlapCallback(
    dude: Phaser.Physics.Arcade.Body, tile: Phaser.Tilemaps.Tile) {

    if (this.dudeMoveState != DudeStates.walk) {
      return
    }

    const levels = this._levels
    const coords = levels.getTilesForCoords(dude.x, dude.y)
    const stairsTip = this._tips.stairsTip || null

    if (tile.x == coords.x && tile.y == coords.y) {
      this.isNearStairs = tile.index != -1
      if (this.isNearStairs) {
        const iconCoords: INumberCoords = { w: dude.x, h: dude.y }
        stairsTip?.setIcon(true, iconCoords)
      } else {
        stairsTip?.setIcon(false, null)
      }
    }
  }

  stickyClimbing() {
    if (this.dudeMoveState != DudeStates.climbing) return

    if (this._isClimbingUp) {
      this.dudeClimbMovementUpdating(true)
    } else {
      this.dudeClimbMovementUpdating(false)
    }
  }

  // movement's functions
  // (left, right)
  dudeMovementUpdating(isLeft: boolean) {
    if (isLeft) {
      this.image.setVelocityX(-160)
      this.image.anims.play('leftDude', true)
    } else {
      this.image.setVelocityX(160)
      this.image.anims.play('rightDude', true)
    }
  }
  // up, down
  dudeClimbMovementUpdating(isUp: boolean) {
    if (isUp) {
      this.image.setVelocityY(-100)
    } else {
      this.image.setVelocityY(110)
    }
  }
  // stop for dude
  dudeStayUpdating() {
    switch (this.dudeMoveState) {
      case DudeStates.walk:
        this.image.anims.play('turnDude', true)
        break
      case DudeStates.climbing:
    }
    this.image.setVelocityX(0)
    this.image.setVelocityY(0)
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
        const dude = this.image
        const coords = this._levels.getTilesForCoords(dude.x, dude.y)
        dude.x = (coords.x + 0.5) * this._levels._tileWidth
        break
      case DudeStates.fighting:
        this.isNearStairs = false
    }

    this._dudeMoveState = newState
    console.log('dude state', DudeStates[this._dudeMoveState])
  }

  // setIsClimbing(value: boolean) {
  // }
}
