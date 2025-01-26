import { Scene, GameObjects, Types, Physics } from 'phaser'

import DudeSet from '@assets/dude.png'
import textMapRaw from '@assets/maps/map4.txt?url'
import tilesRaw from '@assets/kenny_platformer_32.png'

import { MapSceneLevels } from '@/classes/map-scene-levels'

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _controls!: Phaser.Cameras.Controls.FixedKeyControl

  _mapLevels!: MapSceneLevels

  constructor(name: string) {
    super(name)
  }

  create() {

    this._mapLevels = new MapSceneLevels(this, 'textMap', 'tileSet')

    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setBounds(0, 0, this._mapLevels?.mapWidth, this._mapLevels?.mapHeight)

    const cursors = this.input.keyboard?.createCursorKeys()
    if (!cursors) return
    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 1
    }
    this._controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)

    const dude = this.physics.add.sprite(100, 450, 'dude')
  }

  update(time: number, delta: number): void {
    this._controls.update(delta)
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
