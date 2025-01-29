import { Scene, GameObjects, Types, Physics } from 'phaser'
import { IResolution, mainKeys } from '@/types/main-types'

import DudeSet from '@assets/dude.png'
import textMapRaw from '@assets/maps/map0.txt?url'
import tilesRaw from '@assets/kenny_platformer_32.png'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { Dude } from '@/classes/dude'
import { SceneCamera } from '@/classes/scene-camera'

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _cameraControls!: Phaser.Cameras.Controls.FixedKeyControl
  _mapLevels!: MapSceneLevels
  _dude!: Dude
  _camera!: SceneCamera
  _keys!: mainKeys

  constructor(name: string) {
    super(name)
  }

  create() {
    this.setMainKyes()

    this._mapLevels = new MapSceneLevels(this, 'textMap', 'tileSet')
    this.physics.world.setBounds(0, 0, this._mapLevels.mapWidth, this._mapLevels.mapHeight)

    this._camera = new SceneCamera(this, this._mapLevels.mapWidth, this._mapLevels.mapHeight)
    this._dude = new Dude(this, this._mapLevels, this._camera, { width: 32, height: 48 } as IResolution)

    this._camera.startFollow(this._dude.image)
  }

  update(time: number, delta: number): void {
    if (this._keys) {
      this._dude.update(this._keys, this._camera, time, delta)
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

  private setMainKyes() {
    this._keys = this.input?.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as mainKeys
  }
}
