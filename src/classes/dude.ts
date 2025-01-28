import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'
import { IResolution, INumberCoords, mainKeys } from '@/types/main-types'

export class Dude {
  image: Types.Physics.Arcade.SpriteWithDynamicBody
  _dudeStay: boolean = true
  _frame: IResolution
  _camera: SceneCamera

  constructor(
    engine: MainEngine, mapLevels: MapSceneLevels, camera: SceneCamera, frameResolution: IResolution) {

    this._frame = frameResolution
    const startMapCoords = mapLevels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h
    }

    this.image = engine.physics.add.sprite(startCoords.w, startCoords.h, 'dude')
    this.image.setBounce(0.1)
    this.image.setCollideWorldBounds(true)
    this.image.body.setAllowGravity(true)
    this.image.body.setGravityY(50)
    // test

    this._camera = camera

    this._camera.startFollow(this.image)
    this.setStandartOffset()
    this._camera.setDefaultZoom()

    if (!mapLevels.groundLayer) return
    engine.physics.add.collider(this.image, mapLevels.groundLayer)

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

  setStandartOffset() {
    this._camera.setFollowOffser(0, 100)
  }

  update(keys: mainKeys, time: number, delta: number): void {
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
      this._camera.setFollowOffser(0, -100)
    } else {
      this.image.setVelocityX(0)
      // this.image.setVelocityY(0)
      this.image.anims.play('turnDude', true)
      this.setStandartOffset()
    }

    this._camera.isZooming = keys.shift.isDown
  }
}
