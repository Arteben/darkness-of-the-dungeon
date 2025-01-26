import { Scene, GameObjects, Types, Physics } from 'phaser'

import DudeSet from '@assets/dude.png'
import textMapRaw from '@assets/maps/map1.txt?url'
import tilesRaw from '@assets/kenny_platformer_32.png'

import { MapSceneLevels } from '@/classes/map-scene-levels'

export interface dudeKyes {
  a: Phaser.Input.Keyboard.Key
  d: Phaser.Input.Keyboard.Key
}

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _cameraControls!: Phaser.Cameras.Controls.FixedKeyControl
  _kyes: dudeKyes | undefined
  _mapLevels!: MapSceneLevels
  _dude!: Types.Physics.Arcade.SpriteWithDynamicBody

  constructor(name: string) {
    super(name)
  }

  create() {
    this._mapLevels = new MapSceneLevels(this, 'textMap', 'tileSet')

    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setBounds(0, 0, this._mapLevels?.mapWidth, this._mapLevels?.mapHeight)

    this._kyes = this.input?.keyboard?.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as dudeKyes

    const arrowCameraControls = this.input.keyboard?.createCursorKeys()
    if (!arrowCameraControls) return
    const controlConfig = {
      camera: this.cameras.main,
      left: arrowCameraControls.left,
      right: arrowCameraControls.right,
      up: arrowCameraControls.up,
      down: arrowCameraControls.down,
      speed: 1
    }
    this._cameraControls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)

    this._dude = this.physics.add.sprite(100, 470, 'dude')
    this._dude.setBounce(0.2)
    this._dude.setCollideWorldBounds(true)
    this._dude.body.setGravityY(100)

    if (!this._mapLevels.groundLayer) return
    this.physics.add.collider(this._dude, this._mapLevels.groundLayer)

    this.anims.create({
      key: 'leftDude',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turnDude',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    this.anims.create({
      key: 'rightDude',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })
  }

  update(time: number, delta: number): void {
    this._cameraControls.update(delta)

    if (!this._kyes) return

    if (this._kyes.a.isDown) {
      this._dude.setVelocityX(-160)
      this._dude.anims.play('leftDude', true)
    }
    else if (this._kyes.d.isDown) {
      this._dude.setVelocityX(160)
      this._dude.anims.play('rightDude', true)
    }
  }

  preload() {
    // progress bar
    this._progress = this.add.graphics()
    this.load.on('progress', this.onDrawProgressBar, this)
    this.load.on('complete', () => { this._progress.destroy() })
    //

    this.load.image('tileSet', tilesRaw)
    this.load.text('textMap', textMapRaw)

    this.load.spritesheet('dude', DudeSet, { frameWidth: 32, frameHeight: 48 })
  }

  private onDrawProgressBar(value: number) {
    this._progress.clear()
    this._progress.fillStyle(0xffffdd, 1)
    const gameSize = this.scale.gameSize
    this._progress.fillRect(0, (gameSize.height - 22), gameSize.width * value, 20)
  }
}
