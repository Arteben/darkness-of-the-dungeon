import { Scene, GameObjects, Types, Physics } from 'phaser'
import { IResolution } from '@/types/main-types'

import DudeSet from '@assets/dude.png'
import textMapRaw from '@assets/maps/map0.txt?url'
import tilesRaw from '@assets/kenny_platformer_32.png'

import { MapSceneLevels } from '@/classes/map-scene-levels'
import { Dude } from '@/classes/dude'
import { MainCamera } from '@/classes/main-camara'

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _cameraControls!: Phaser.Cameras.Controls.FixedKeyControl
  _mapLevels!: MapSceneLevels
  _dude!: Dude
  _mainCamera!: MainCamera

  constructor(name: string) {
    super(name)
  }

  create() {
    this._mapLevels = new MapSceneLevels(this, 'textMap', 'tileSet')
    this._mainCamera = new MainCamera(this, this._mapLevels)
    this._dude = new Dude(this, this._mapLevels, {width: 32, height: 48} as IResolution)
  }

  update(time: number, delta: number): void {
    this._mainCamera.cameraControls.update(delta)
    this._dude.update(time, delta)
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
