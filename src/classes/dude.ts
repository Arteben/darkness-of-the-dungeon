import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'
import { IconTip } from '@/classes/icon-tip'

import {
  IResolution, INumberCoords, mainKeys, overlapCallbackParams
} from '@/types/main-types'

export class Dude {
  image: Types.Physics.Arcade.SpriteWithDynamicBody
  _dudeStay: boolean = true
  _frame: IResolution
  _levels: MapSceneLevels

  // isGravInfluence
  private _isGravInfluence: boolean = true
  public set isGravInfluence(value: boolean) {
    this.setIsGrafInfluence(value)
  }
  public get isGravInfluence(): boolean {
    return this._isGravInfluence
  }
  //

  constructor(
    engine: MainEngine, mapLevels: MapSceneLevels, camera: SceneCamera, frameResolution: IResolution) {

    this._frame = frameResolution
    this._levels = mapLevels

    const startMapCoords = this._levels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h
    }

    this.image = engine.physics.add.sprite(startCoords.w, startCoords.h, 'dude')
    this.image.setBounce(0)
    this.image.setCollideWorldBounds(true)
    this.isGravInfluence = true

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

  update(keys: mainKeys, camera: SceneCamera, time: number, delta: number): void {
    if (keys.left.isDown) {
      this.image.setVelocityX(-160)
      this.image.anims.play('leftDude', true)
    } else if (keys.right.isDown) {
      this.image.setVelocityX(160)
      this.image.anims.play('rightDude', true)
    } else if (keys.up.isDown) {
      this.image.setVelocityY(-100)
      this.image.anims.play('turnDude', false)
    } else if (keys.down.isDown && !this.image.body.touching.down) {
      this.image.setVelocityY(100)
      this.image.anims.play('turnDude', false)
      camera.setDownMoveOffset()
    } else {
      this.image.setVelocityX(0)
      // this.image.setVelocityY(0)
      this.image.anims.play('turnDude', true)
      camera.setStandartOffset()
    }

    camera.isZooming = keys.shift.isDown
  }

  private setIsGrafInfluence(flag: boolean) {
    if (flag) {
      this.image.body.setGravityY(100)
    } else {
      this.image.body.setGravityY(0)
    }
    this._isGravInfluence = flag
    this.image.body.setAllowGravity(flag)
  }

  updateOverlapCallback(
    dude: Phaser.Physics.Arcade.Body, tile: Phaser.Tilemaps.Tile, starirsTip: IconTip) {
    const levels = this._levels
    const coords = levels.getTilesForCoords(dude.x, dude.y)

    if (tile.x == coords.x && tile.y == coords.y) {
      const isStairs =
        tile.index == levels.getTileNum('tt') || tile.index == levels.getTileNum('T')
      this.isGravInfluence = !isStairs
      if (isStairs) {
        const iconCoords: INumberCoords = {w: dude.x, h: dude.y}
        starirsTip.setIcon(true, iconCoords)
      } else {
        starirsTip.setIcon(false, null)
      }
    }
  }
}
