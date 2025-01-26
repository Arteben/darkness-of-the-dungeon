import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MainEngine } from '@/classes/main-engine'

import { IMapTilesIndexes } from '@/types/phaser-types'

// import DudeSet from '@assets/dude.png'

const tileIndexes: IMapTilesIndexes = {
  '#': 14, 'D': 53, 'DD': 58, 't': 18, 'tt': 23, 'k': 34, 'B': 7, 'w': 4, 'ww': 6, 'T': 33, 'A': 16
}

export class MapSceneLevels {
  _tileIndexes = tileIndexes

  symbolMap: Array<string>

  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  envLayer!: Phaser.Tilemaps.TilemapLayer | null

  _tileWidth = 32

  mapWidth = 0
  mapHeight = 0

  constructor(engine: MainEngine, nameSymbolMap: string, groundTileSetName: string) {

    const symbolMap: Array<string> = engine.cache.text.get(nameSymbolMap).split('\n')
    this.symbolMap = symbolMap
    if (symbolMap[symbolMap.length - 1].length == 0) {
      symbolMap.splice(symbolMap.length - 1, 1)
    }

    if (!(symbolMap.length > 0 && symbolMap[0].length > 0)) {
      console.error('Something wrong with json map, json dont load correctly!')
      return
    }

    this.mapWidth = symbolMap[0].length * this._tileWidth
    this.mapHeight  = symbolMap.length * this._tileWidth

    const map = engine.make.tilemap({
      width: symbolMap[0].length, height: symbolMap.length,
      tileWidth: this._tileWidth, tileHeight: this._tileWidth
    })

    const tileset = map.addTilesetImage(groundTileSetName) as Phaser.Tilemaps.Tileset

    this.groundLayer = MapSceneLevels.getLayerForSymbols(['#'], 'groundLayer', map, tileset, symbolMap)
    this.envLayer = MapSceneLevels.getLayerForSymbols(['D', 't', 'k', 'B', 'w', 'T', 'A'], 'env-layer', map, tileset, symbolMap)
  }

  static getLayerForSymbols(
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
