import { Scene, GameObjects, Types, Physics } from 'phaser'

// import tiles from '@/assets/kenny_platformer_64x64.png'
// import envTiles from '@assets/env-tileset.png'
// import groundTiles from '@assets/ground-tileset.png'
import textMapRaw from '@/assets/map.txt?url'

import tilesRaw from '@assets/kenny_platformer_32.png'
const tileIndexes = {
  '+': 14,
  'd': 53,
  'dd': 58,
  's': 18,
  'ss': 23,
  'f': 15,
}

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
  _groundLayer!: Phaser.Tilemaps.TilemapLayer
  // _symbolMap!: Array<string>

  _tileWidth = 32

  constructor(name: string) {
    super(name)
  }

  create() {
    const symbolMap: Array<string> = this.cache.text.get('textMap').split('\n')
    if (symbolMap[symbolMap.length - 1].length == 0) {
      symbolMap.splice(symbolMap.length - 1, 1)
    }
    this.getLayerForSymbols(['+'], symbolMap)
    // this._groundLayer = this.getLayerForSymbols(['+'], symbolMap)
    // this._mapIndexes = this.getMapIndexes()
    // this._groundLayer = this.getLayer()
    // this._map = this.make.tilemap({ key: 'multiple-layers-map' })
    // const tiles = this._map.addTilesetImage('kenny_platformer_64x64')
    // if (!tiles) { return }

    // this._layers = {
    //   rockLayer: this._map.createLayer('Rock Layer', tiles, 0, 0),
    //   waterLayer: this._map.createLayer('Water Layer', tiles, 0, 0),
    //   platformLayer: this._map.createLayer('Platform Layer', tiles, 0, 0),
    //   stuffLayer: this._map.createLayer('Stuff Layer', tiles, 0, 0),
    // }

    this.cameras.main.setScroll(0, 1000)
    this.cameras.main.setBounds(0, 0, 200, 200)

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
  }

  private onDrawProgressBar(value: number) {
    this._progress.clear()
    this._progress.fillStyle(0xffffdd, 1)
    const gameSize = this.scale.gameSize
    this._progress.fillRect(0, (gameSize.height - 22), gameSize.width * value, 20)
  }

  private getLayerForSymbols(symbols: string[], symbolMap: string[]) {
    if (!(symbolMap.length > 0 && symbolMap[0].length > 0)) return

    const width = symbolMap[0].length
    const height = symbolMap.length

    const notNulls = (strings: string[], i: number, j: number) => {
      return strings[i] && !(strings[i][j] == undefined || strings[i][j] == null)
    }

    const indexesMap: Array<Array<number>> = new Array(height)
    for (let i = 0; i < indexesMap.length; i++) {
      indexesMap[i] = new Array(width)
      for (let j = 0; j < indexesMap[i].length; j++) {
        // orders symbolos for this layer
        symbols.findIndex((element) => {
          // check symbol map for null, undefined
          if (!notNulls(symbolMap, i, j)) return false

          if (symbolMap[i][j] == element) {
            // @ts-ignore
            if (notNulls(symbolMap, i - 1, j) && symbolMap[i - 1][j] == element && tileIndexes[element + element]) {
              // @ts-ignore
              indexesMap[i][j] = tileIndexes[element + element]
            } else {
              // @ts-ignore
              indexesMap[i][j] = tileIndexes[element]
            }
            // stop search for these symbols
            return true
          } else {
            // empty element maybe next?
            indexesMap[i][j] = (-1)
            return false
          }
        })
      }
    }
    console.log('indexes map', indexesMap)
    return indexesMap
  }
}
