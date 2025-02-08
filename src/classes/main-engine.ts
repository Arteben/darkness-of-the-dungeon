import { Scene, GameObjects, Types, Physics } from 'phaser'

import {
  IResolution,
  mainKeys,
  overlapCallbackParams,
  IconTips,
  IJsonMap,
  ISelectedMapForInit,
  ILoadedTileSets,
} from '@/types/main-types'

// assets
import dudeSet from '@assets/dude.png'
import tilesRaw from '@assets/castle-tiles.png'
import tilesWallsRaw from '@assets/castle-tileset-walls.png'
import tipIcons from '@assets/tip-icons.png'
import bricksRaw from '@assets/bricks.png'
import charRaw from '@assets/char.png'
//
import { MapSceneLevels } from '@/classes/map-scene-levels'
import { Dude } from '@/classes/dude'
import { SceneCamera } from '@/classes/scene-camera'
import { IconTip } from '@/classes/icon-tip'
//

import { default as JsonMapList } from '@/assets/maps/map-list.json'

const mapList: IJsonMap[] = JsonMapList

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _cameraControls!: Phaser.Cameras.Controls.FixedKeyControl
  _mapLevels!: MapSceneLevels
  _dude!: Dude
  _camera!: SceneCamera
  _keys!: mainKeys
  _tips: IconTips = {}
  _selectedMap: string = ''

  constructor() {
    super()
  }

  init(map: ISelectedMapForInit) {
    this._selectedMap = map.nameMap
  }

  create() {
    // console.log(this.textures.list)

    this.setMainKyes()

    const tls: ILoadedTileSets = {
      walls: 'wallTileSet',
      env: 'tileSet',
      fon: 'backgroundTileSet'
    }

    this._mapLevels = new MapSceneLevels(this, this._selectedMap, tls)
    this.physics.world.setBounds(0, 0, this._mapLevels.mapWidth, this._mapLevels.mapHeight)
    this._camera = new SceneCamera(this, this._mapLevels.mapWidth, this._mapLevels.mapHeight)

    this._tips['stairsTip'] = new IconTip('tipIcons', 39, this, this._camera)

    this._dude = new Dude(
      this, this._mapLevels, this._camera, this._tips, { width: 32, height: 48 } as IResolution)

    this._camera.startFollow(this._dude.player)


    // create overlap dude with stairs for vertical movements
    if (this._mapLevels.stairsLayer) {
      this.physics.add.overlap(this._dude.player, this._mapLevels.stairsLayer,
        (prPlayer: overlapCallbackParams, prTile: overlapCallbackParams) => {
          this._dude.overlapCallbackUpdating(
            prPlayer as Phaser.Physics.Arcade.Body, prTile as Phaser.Tilemaps.Tile)
        })
    }
    //
  }

  update(time: number): void {
    if (this._keys) {
      this._dude.update(this._keys)
    }

    this._tips['stairsTip']?.update(time)
  }

  preload() {
    // progress bar
    this._progress = this.add.graphics()
    this.load.on('progress', this.onDrawProgressBar, this)
    this.load.on('complete', () => { this._progress.destroy() })
    //

    this.load.image('tileSet', tilesRaw)
    this.load.image('wallTileSet', tilesWallsRaw)
    this.load.image('backgroundTileSet', bricksRaw)
    // load for maps
    // '/src/assets/maps/map3.txt'
    mapList.forEach((el: IJsonMap)=> {
      this.load.text(el.name, `/src/assets/${el.file}`)
    })

    this.load.spritesheet('dude', charRaw, { frameWidth: 56, frameHeight: 56 })
    this.load.spritesheet('tipIcons', tipIcons, { frameWidth: 32, frameHeight: 32 })
  }

  onDrawProgressBar(value: number) {
    this._progress.clear()
    this._progress.fillStyle(0xffffdd, 1)
    const gameSize = this.scale.gameSize
    this._progress.fillRect(0, (gameSize.height - 22), gameSize.width * value, 20)
  }

  setMainKyes() {
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
