import { MainEngine } from '@/classes/main-engine'

import { IMapTilesIndexes, INumberCoords } from '@/types/main-types'

// import DudeSet from '@assets/dude.png'

export class MapSceneLevels {
  _tileIndexes: IMapTilesIndexes = {
    '#': 14, 'D': 53, 'DD': 58, 't': 18, 'tt': 23, 'k': 34, 'B': 7, 'w': 4, 'ww': 6, 'T': 33, 'A': 16
  }

  _symbolMap: Array<string>

  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  stairsLayer!: Phaser.Tilemaps.TilemapLayer | null
  envLayer!: Phaser.Tilemaps.TilemapLayer | null

  _tileWidth = 32

  mapWidth = 0
  mapHeight = 0

  constructor(engine: MainEngine, nameSymbolMap: string, groundTileSetName: string) {

    const symbolMap: Array<string> = engine.cache.text.get(nameSymbolMap).split('\n')
    this._symbolMap = symbolMap
    if (symbolMap[symbolMap.length - 1].length == 0) {
      symbolMap.splice(symbolMap.length - 1, 1)
    }

    if (!(symbolMap.length > 0 && symbolMap[0].length > 0)) {
      console.error('Something wrong with json map, json dont load correctly!')
      return
    }

    this.mapWidth = symbolMap[0].length * this._tileWidth
    this.mapHeight = symbolMap.length * this._tileWidth

    const map = engine.make.tilemap({
      width: symbolMap[0].length, height: symbolMap.length,
      tileWidth: this._tileWidth, tileHeight: this._tileWidth
    })

    map.addTilesetImage(groundTileSetName)

    this.groundLayer = this.createLayer(['#'], 'groundLayer', groundTileSetName, map)
    this.groundLayer?.setCollisionByExclusion([-1])

    this.stairsLayer = this.createLayer(['t', 'T'], 'stairsLayer', groundTileSetName, map)
    this.stairsLayer?.setCollisionByExclusion([-1])

    this.envLayer = this.createLayer(['D', 'k', 'B', 'w', 'A'], 'envLayer', groundTileSetName, map)
  }

  private createLayer(
    symbols: string[], nameKey: string, tileset: string, map: Phaser.Tilemaps.Tilemap) {

    const indexes = this.getIndexesForTiles(symbols)

    const layer = map.createBlankLayer(nameKey, tileset)
    return layer && layer.putTilesAt(indexes, 0, 0) || null
  }

  private getIndexesForTiles(symbols: string[]) {
    const symMap = this._symbolMap
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
            if (notNulls(symMap, i - 1, j) && symMap[i - 1][j] == element && this._tileIndexes[element + element]) {
              indexesMap[i][j] = this._tileIndexes[element + element]
            } else {
              indexesMap[i][j] = this._tileIndexes[element]
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

    return indexesMap
  }

  getCoordsForFirstSymbol(symb: string) {

    let coords: INumberCoords | null = null
    let wCoord
    let hCoord

    for (let i = 0; i < this._symbolMap.length; i++) {
      const lineString = this._symbolMap[i]
      hCoord = lineString.indexOf(symb)
      if (hCoord > -1) {
        wCoord = i
        break
      }
    }

    if (wCoord != undefined && hCoord != undefined) {
      coords = {
        h: wCoord * this._tileWidth,
        w: hCoord * this._tileWidth
      }
    }

    return coords
  }
}
