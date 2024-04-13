import { Scene, GameObjects, Types, Physics } from 'phaser'

import { IMapTilesIndexes } from '@/types/phaser-types'

import textMapRaw from '@assets/map.txt?url'
import tilesRaw from '@assets/kenny_platformer_32.png'
const tileIndexes: IMapTilesIndexes = {
  '+': 14, 'd': 53, 'dd': 58, 's': 18, 'ss': 23, 'f': 16,
}

export class MainEngineScene extends Scene {
  _progress!: GameObjects.Graphics
  _controls!: Phaser.Cameras.Controls.FixedKeyControl

  _groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  _envLayer!: Phaser.Tilemaps.TilemapLayer | null

  _tileWidth = 32

  constructor(name: string) {
    super(name)
  }

  create() {
    const symbolMap: Array<string> = this.cache.text.get('textMap').split('\n')
    if (symbolMap[symbolMap.length - 1].length == 0) {
      symbolMap.splice(symbolMap.length - 1, 1)
    }

    if (!(symbolMap.length > 0 && symbolMap[0].length > 0)) {
      console.error('Something wrong with json map, json dont load correctly!')
      return
    }

    const map = this.make.tilemap({
      width: symbolMap[0].length, height: symbolMap.length,
      tileWidth: this._tileWidth, tileHeight: this._tileWidth
    })
    const tileset = map.addTilesetImage('tileSet') as Phaser.Tilemaps.Tileset

    this._groundLayer = this.getLayerForSymbols(['+'], 'groundLayer', map, tileset, symbolMap)
    this._envLayer = this.getLayerForSymbols(['d', 's', 'f'], 'env-layer', map, tileset, symbolMap)

    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setBounds(0, 0, 1000, 200)

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

  private getLayerForSymbols(
    symbols: string[], nameLayer: string, map: Phaser.Tilemaps.Tilemap, tiles: Phaser.Tilemaps.Tileset, symMap: string[]) {

    const width = symMap[0].length
    const height = symMap.length

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
          if (!notNulls(symMap, i, j)) return false

          if (symMap[i][j] == element) {
            if (notNulls(symMap, i - 1, j) && symMap[i - 1][j] == element && tileIndexes[element + element]) {
              indexesMap[i][j] = tileIndexes[element + element]
            } else {
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

    const layer = map.createBlankLayer(nameLayer, tiles)
    if (!layer) { return null }
    layer.putTilesAt(indexesMap, 0, 0)
    return layer
  }
}
