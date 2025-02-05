import { MainEngine } from '@/classes/main-engine'

import { IMapTilesIndexes, INumberCoords, ITilesCoords } from '@/types/main-types'
import { TileSetModificators } from '@/types/enums'

// import DudeSet from '@assets/dude.png'

export class MapSceneLevels {
  _tileIndexes: IMapTilesIndexes = {
    '#0': 9, '#15': 4, '#8': 17, '#4': 1,
    '#12': 12, '#1': 10, '#2': 8,
    '#10': 16, '#6': 0, '#5': 2, '#9': 18,
    '#3': 3, '#14': 42, '#16': 40, '#17': 24, '#13': 26, '#7': 11, '#11': 19,
    'D': 55, 't': 52, 'tt': 53, 'k': 54, 'B': 13, 'A': 50, 'l': 48, 'p': 47
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
    this.groundLayer = this.createLayer(['#'], 'groundLayer', TileSetModificators.ground, groundTileSetName, map)
    this.groundLayer?.setCollisionByExclusion([-1])

    this.stairsLayer = this.createLayer(['t'], 'stairsLayer', TileSetModificators.ladders, groundTileSetName, map)
    // this.stairsLayer?.setCollisionByExclusion([18, 33])

    this.envLayer = this.createLayer(['D', 'k', 'B', 'w', 'A', 'l', 'p'], 'envLayer', TileSetModificators.none, groundTileSetName, map)
  }

  createLayer(
    symbols: string[], nameKey: string, mod: TileSetModificators, tileset: string, map: Phaser.Tilemaps.Tilemap) {

    const indexes = this.getIndexesForTiles(symbols, mod)

    const layer = map.createBlankLayer(nameKey, tileset)
    return layer && layer.putTilesAt(indexes, 0, 0) || null
  }

  notNullsMapElement(strings: string[], i: number, j: number) {
    return strings[i] && !(strings[i][j] == undefined || strings[i][j] == null)
  }

  getIndexesForTiles(symbols: string[], modificator: TileSetModificators) {
    const symMap = this._symbolMap
    const width = symMap[0].length
    const height = symMap.length

    const indexesMap: Array<Array<number>> = new Array(height)
    for (let i = 0; i < indexesMap.length; i++) {
      indexesMap[i] = new Array(width)
      for (let j = 0; j < indexesMap[i].length; j++) {
        // orders symbolos for this layer
        symbols.findIndex((element) => {
          // check symbol map for null, undefined
          if (!this.notNullsMapElement(symMap, i, j)) return false

          if (symMap[i][j] == element) {
            if (modificator == TileSetModificators.ground) {
              this.setElementForGroundMod(i, j, element, indexesMap)
            }
            // for stairs, draw begin for ladders
            else if (modificator == TileSetModificators.ladders) {
              this.setElementForLadderMod(i, j, element, indexesMap)
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

  setElementForLadderMod(i: number, j: number, element: string, map: Array<Array<number>>) {
    const symMap = this._symbolMap
    if (this.notNullsMapElement(symMap, i - 1, j) && symMap[i - 1][j] == element && this._tileIndexes[element + element]) {
      map[i][j] = this._tileIndexes[element + element]
    } else {
      map[i][j] = this._tileIndexes[element]
    }
  }

  setElementForGroundMod(i: number, j: number, element: string, map: Array<Array<number>>) {
    const symMap = this._symbolMap

    const notNull = (ip: number, jp: number) => {
      return this.notNullsMapElement(symMap, ip, jp)
    }

    let spaceCounter = 0
    if (notNull(i - 1, j) && symMap[i - 1][j] != element)
      spaceCounter += 4

    if (notNull(i + 1, j) && symMap[i + 1][j] != element)
      spaceCounter += 8

    if (notNull(i, j - 1) && symMap[i][j - 1] != element)
      spaceCounter += 2

    if (notNull(i, j + 1) && symMap[i][j + 1] != element)
      spaceCounter += 1

    if (spaceCounter == 0) {
      if (notNull(i - 1, j - 1) && symMap[i - 1][j - 1] != element) {
        spaceCounter = 14
      } else if (notNull(i - 1, j + 1) && symMap[i - 1][j + 1] != element) {
        spaceCounter = 16
      } else if (notNull(i + 1, j + 1) && symMap[i + 1][j + 1] != element) {
        spaceCounter = 17
      } else if (notNull(i + 1, j - 1) && symMap[i + 1][j - 1] != element) {
        spaceCounter = 13
      }
    }

    map[i][j] = this._tileIndexes['#' + spaceCounter]
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

  getTilesForCoords(width: number, heigh: number): ITilesCoords {
    const tileSize = this._tileWidth
    return {
      x: Math.floor(width / tileSize),
      y: Math.floor(heigh / tileSize)
    }
  }

  getTileNum(sym: string) {
    return this._tileIndexes[sym]
  }
}
