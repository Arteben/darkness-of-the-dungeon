import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { MainEngine } from '@/classes/main-engine'
import { IResolution, INumberCoords } from '@/types/main-types'

export interface dudeKyes {
  a: Phaser.Input.Keyboard.Key
  d: Phaser.Input.Keyboard.Key
}

export class Dude {
  _kyes: dudeKyes | undefined
  _dude!: Types.Physics.Arcade.SpriteWithDynamicBody

  _dudeStay: boolean = true

  _frame: IResolution

  constructor(engine: MainEngine, mapLevels: MapSceneLevels, frameResolution: IResolution) {
    this._kyes = engine.input?.keyboard?.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as dudeKyes

    this._frame = frameResolution

    const startMapCoords = mapLevels.getCoordsForFirstSymbol('B')
    const startCoords: INumberCoords = { w: 0, h: 0 }

    if (startMapCoords) {
      startCoords.w = startMapCoords.w + this._frame.width / 2
      startCoords.h = startMapCoords.h
    }

    this._dude = engine.physics.add.sprite(startCoords.w, startCoords.h, 'dude')
    this._dude.setBounce(0.1)
    this._dude.setCollideWorldBounds(true)
    this._dude.body.setGravityY(100)

    if (!mapLevels.groundLayer) return
    engine.physics.add.collider(this._dude, mapLevels.groundLayer)

    this._dude.anims.create({
      key: 'leftDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this._dude.anims.create({
      key: 'turnDude',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    this._dude.anims.create({
      key: 'rightDude',
      frames: engine.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
  }

  update(time: number, delta: number): void {
    // dude movements
    if (!this._kyes) return

    if (this._kyes.a.isDown) {
      this._dude.setVelocityX(-160)
      this._dude.anims.play('leftDude', true)
    } else if (this._kyes.d.isDown) {
      this._dude.setVelocityX(160)
      this._dude.anims.play('rightDude', true)
    } else {
      this._dude.setVelocityX(0)
      this._dude.anims.play('turnDude', true)
    }
  }

}
