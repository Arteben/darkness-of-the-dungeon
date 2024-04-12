import { Scene, GameObjects, Types, Physics } from 'phaser'

import tiles from '@/assets/kenny_platformer_64x64.png'
import mapJSONUrl from '@assets/multiple-layers.json?url'

interface layers {
  rockLayer: Phaser.Tilemaps.TilemapLayer | null
  waterLayer: Phaser.Tilemaps.TilemapLayer | null
  platformLayer: Phaser.Tilemaps.TilemapLayer | null
  stuffLayer: Phaser.Tilemaps.TilemapLayer | null
}

export class MainEngineScene extends Scene {
  _progress!: GameObjects.Graphics
  _map!: Phaser.Tilemaps.Tilemap
  _layers!: layers
  _controls!: Phaser.Cameras.Controls.FixedKeyControl

  constructor(name: string) {
    super(name)
  }

  create() {
    this._map = this.make.tilemap({ key: 'multiple-layers-map' })
    const tiles = this._map.addTilesetImage('kenny_platformer_64x64')
    if (!tiles) { return }

    this._layers = {
      rockLayer: this._map.createLayer('Rock Layer', tiles, 0, 0),
      waterLayer: this._map.createLayer('Water Layer', tiles, 0, 0),
      platformLayer: this._map.createLayer('Platform Layer', tiles, 0, 0),
      stuffLayer: this._map.createLayer('Stuff Layer', tiles, 0, 0),
    }

    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setBounds(0, 0, this._map.widthInPixels, this._map.heightInPixels)

    const cursors = this.input.keyboard?.createCursorKeys()
    if (!cursors) return
    const controlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    }
    this._controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
  }

  update(time: number, delta: number): void {
    this._controls.update(delta)
    const cam = this.cameras.main
    const worldPoint = this.input.activePointer.positionToCamera(cam)
  }

  preload() {
    // progress bar
    this._progress = this.add.graphics()
    this.load.on('progress', this.onDrawProgressBar, this)
    this.load.on('complete', () => { this._progress.destroy() })
    //
    this.load.image('kenny_platformer_64x64', tiles)
    this.load.tilemapTiledJSON('multiple-layers-map', mapJSONUrl)
  }

  private onDrawProgressBar(value: number) {
    this._progress.clear()
    this._progress.fillStyle(0xffffdd, 1)
    const gameSize = this.scale.gameSize
    this._progress.fillRect(0, (gameSize.height - 22), gameSize.width * value, 20)
  }
}
