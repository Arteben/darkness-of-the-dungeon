import { MainEngine } from '@/classes/main-engine'

import { IMapTilesIndexes, INumberCoords, ITilesCoords } from '@/types/main-types'
import { TileSetModificators } from '@/types/enums'

// import DudeSet from '@assets/dude.png'

const nums: number[] = []

export class MapSceneLevels {
  _tileWallInxs: IMapTilesIndexes = {
    '#0': 9, '#16': 40,
    '#17': 10, '#18': 4, '#19': 4, '#20': 1, '#21': 4, '#22': 4, '#24': 4, '#25': 4, '#26': 4,
    '#27': 4, '#28': 4, '#29': 4, '#30': 4, '#32': 24, '#33': 10, '#34': 4, '#35': 4, '#36': 4,
    '#37': 4, '#38': 4, '#40': 17, '#41': 4, '#42': 4, '#43': 4, '#44': 4, '#45': 4, '#46': 4,
    '#48': 6, '#49': 10, '#51': 4,
    '#53': 4, '#60': 28, '#64': 26, '#65': 4, '#66': 8, '#67': 4, '#68': 4,
    '#70': 4, '#72': 17, '#73': 4, '#74': 4, '#75': 4, '#76': 4, '#77': 4, '#78': 4,
    '#80': 4, '#81': 4, '#82': 4, '#83': 4, '#84': 4, '#86': 4,
    '#88': 4, '#89': 4, '#90': 4, '#91': 4, '#92': 28, '#93': 4, '#94': 4,
    '#96': 15, '#98': 4, '#99': 3, '#104': 17, '#106': 4, '#108': 4,
    '#100': 4, '#112': 4, '#113': 23, '#114': 4, '#115': 3, '#116': 4, '#118': 4,
    '#120': 38, '#121': 18, '#122': 4, '#123': 4, '#124': 28, '#125': 4, '#126': 4,
    '#128': 42, '#129': 4, '#130': 8, '#131': 4, '#132': 1, '#134': 4, '#133': 4,
    '#136': 28, '#137': 4, '#138': 4, '#139': 4, '#140': 4, '#141': 4, '#142': 4, '#144': 14,
    '#147': 3, '#148': 1, '#160': 4, '#172': 28,
    '#176': 4, '#177': 31, '#179': 3, '#180': 46, '#181': 2, '#188': 28, '#192': 7, '#194': 8,
    '#196': 4, '#204': 28, '#208': 4, '#210': 39, '#211': 3, '#212': 22, '#214': 0,'#220': 28,
    '#224': 4, '#226': 47, '#227': 3,
    '#232': 30, '#234': 16, '#236': 28,
    '#240': 37, '#241': 52, '#242': 51, '#243': 3, '#244': 60, '#245': 36, '#246': 35, '#247': 11,
    '#248': 59, '#249': 44, '#250': 43, '#251': 19, '#252': 28, '#253': 29, '#254': 27,
  }
  _tileIndexes: IMapTilesIndexes = {
    'D': 55, 't': 52, 'tt': 53, 'k': 54, 'B': 13, 'A': 50, 'l': 48, 'p': 47
  }

  _symbolMap: Array<string>

  groundLayer!: Phaser.Tilemaps.TilemapLayer | null
  stairsLayer!: Phaser.Tilemaps.TilemapLayer | null
  envLayer!: Phaser.Tilemaps.TilemapLayer | null

  _tileWidth = 32

  mapWidth = 0
  mapHeight = 0

  constructor(engine: MainEngine, nameSymbolMap: string, envTls: string, wallsTls: string) {

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

    map.addTilesetImage(envTls)
    map.addTilesetImage(wallsTls)
    this.groundLayer = this.createLayer(
      ['#'], 'groundLayer', TileSetModificators.ground, wallsTls, this._tileWallInxs, map)
    this.groundLayer?.setCollisionByExclusion([-1])

    this.stairsLayer = this.createLayer(
      ['t'], 'stairsLayer', TileSetModificators.ladders, envTls, this._tileIndexes, map)

    this.envLayer = this.createLayer(
      ['D', 'k', 'B', 'w', 'A', 'l', 'p'], 'envLayer', TileSetModificators.none, envTls, this._tileIndexes, map)
  }

  createLayer(
    symbols: string[], nameKey: string,
    mod: TileSetModificators, tileset: string, tileNums: IMapTilesIndexes, map: Phaser.Tilemaps.Tilemap) {

    const indexes = this.getIndexesForTiles(symbols, mod, tileNums)

    const layer = map.createBlankLayer(nameKey, tileset)
    return layer && layer.putTilesAt(indexes, 0, 0) || null
  }

  notNullsMapElement(strings: string[], i: number, j: number) {
    return strings[i] && !(strings[i][j] == undefined || strings[i][j] == null)
  }

  getIndexesForTiles(symbols: string[], modificator: TileSetModificators, nums: IMapTilesIndexes) {
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
              this.setElementForGroundMod(i, j, element, indexesMap, nums)
            }
            // for stairs, draw begin for ladders
            else if (modificator == TileSetModificators.ladders) {
              this.setElementForLadderMod(i, j, element, indexesMap, nums)
            } else {
              indexesMap[i][j] = nums[element]
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

  setElementForLadderMod(i: number, j: number, element: string, map: Array<Array<number>>, tileNums: IMapTilesIndexes) {
    const symMap = this._symbolMap
    if (this.notNullsMapElement(symMap, i - 1, j) && symMap[i - 1][j] == element && tileNums[element + element]) {
      map[i][j] = tileNums[element + element]
    } else {
      map[i][j] = tileNums[element]
    }
  }

  setElementForGroundMod(i: number, j: number, element: string, map: Array<Array<number>>, tileNums: IMapTilesIndexes) {
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

    if (notNull(i - 1, j - 1) && symMap[i - 1][j - 1] != element) {
      spaceCounter += 128
    }
    if (notNull(i - 1, j + 1) && symMap[i - 1][j + 1] != element) {
      spaceCounter += 16
    }
    if (notNull(i + 1, j + 1) && symMap[i + 1][j + 1] != element) {
      spaceCounter += 32
    }
    if (notNull(i + 1, j - 1) && symMap[i + 1][j - 1] != element) {
      spaceCounter += 64
    }

    // if (spaceCounter > 15) {
    //   const findedIndex = nums.findIndex(element => element == spaceCounter)
    //   if (findedIndex == -1 && typeof this._tileWallInxs['#' + spaceCounter] == 'undefined') {
    //     nums.push(spaceCounter)
    //   }
    // }

    // nums.sort()

    // console.log('nums', nums)

    map[i][j] = tileNums['#' + spaceCounter]
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
