import { GameObjects, Physics } from 'phaser'
import {
  IPocketDroppedItemSprites,
  INumberCoords,
  ITilesCoords,
  IPocketItemStoreData,
} from '@/types/main-types'
import { CheckSymMapElements } from '@/types/enums'

import { PocketItem } from '@/classes/pocket-item'
import { MainEngine } from '@/classes/main-engine'
import { MapSceneLevels } from '@/classes/map-scene-levels'

export class DroppedItemsSystem {

  items: IPocketDroppedItemSprites = {}

  _group: Physics.Arcade.Group
  _key: string
  _levels: MapSceneLevels

  constructor(
    engine: MainEngine, groundLevels: MapSceneLevels, textureKey: string) {
    this._group = engine.physics.add.group({
      bounceY: 0.4,
      collideWorldBounds: true
    })

    this._levels = groundLevels


    if (this._levels.groundLayer) {
      engine.physics.add.collider(this._group, this._levels.groundLayer)
    }

    this._key = textureKey
  }

  getCoordsFromTilePos({ x, y }: ITilesCoords): INumberCoords {
    const w = (x + 0.5) * this._levels.tileWidth
    const h = (y - 0.5) * this._levels.tileWidth
    return { w, h }
  }

  findPlaceForItem({ x, y }: ITilesCoords): ITilesCoords | null {
    const checker = this._levels.isCheckSymbMapElements.bind(this._levels)

    const simpleCheck = (_x: number, _y: number) => {
      return checker(CheckSymMapElements.empty, _x, _y) &&
        checker(CheckSymMapElements.wall, _x, _y + 1)
    }

    if (simpleCheck(x, y)) return { x, y }

    const getIndent = (num: number): number => {
      let indent

      if (num % 2 > 0) {
        indent = Math.ceil(num / 2)
      } else {
        indent = -(num / 2)
      }

      return indent
    }

    const attemptCout = 6
    for (let i = 1; i <= attemptCout; i++) {
      const checkedX = x + getIndent(i)
      if (simpleCheck(checkedX, y)) return { x: checkedX, y }
    }

    return null
  }

  getStringNameForCoords(coords: ITilesCoords) {
    const getStringFromNum = (num: number): string => {
      const powerCount = 4
      const numString = String(num)
      const zeroCount = powerCount - numString.length
      return new Array(zeroCount + 1).join('0') + numString
    }

    return getStringFromNum(coords.x) + getStringFromNum(coords.y)
  }

  addDroppedItem(coords: ITilesCoords, item: Physics.Arcade.Sprite) {
    const coordsStr = this.getStringNameForCoords(coords)
    if (this.items[coordsStr]) {
      this.items[coordsStr].push(item)
    } else {
      this.items[coordsStr] = [item]
    }
  }

  // drop some item on ground
  drop(coords: ITilesCoords, item: PocketItem): boolean {

    const checkedCoords = this.findPlaceForItem(coords)
    if (checkedCoords == null) {
      console.error('Dont place item for coorrds: ', coords.x, coords.y)
      return false
    }

    const pos = this.getCoordsFromTilePos(checkedCoords)
    const child: Physics.Arcade.Sprite = this._group.create(pos.w, pos.h, this._key, item.type)

    // setted visible for this item
    child.setScale(0.7, 0.7)
    child.setSize(item.sizes.x, item.sizes.y)

    this.addDroppedItem(checkedCoords, child)

    return true
  }

  checkItemInTile(coords: ITilesCoords, type: string) {
    const itemsForTile = this.items[this.getStringNameForCoords(coords)]

    if (!itemsForTile) return false

    const item = itemsForTile.find((_item) => {
      return _item.frame.name == type
    })

    return item != undefined
  }

  pickupItem(itemData: IPocketItemStoreData) {
    const itemsForTile = this.items[this.getStringNameForCoords(itemData.coords)]
    if (!itemsForTile) {
      console.error('dont find coords for pickup item', itemData.coords)
      return false
    }

    const findedIndex = itemsForTile.findIndex((_item) => {
      return _item.frame.name == itemData.type
    })

    if (findedIndex < 0) {
      console.error('dont find coords for pickup item type', itemData)
      return false
    } else {
      this._group.remove(itemsForTile[findedIndex])
      itemsForTile[findedIndex].destroy(true)
      itemsForTile.splice(findedIndex, 1)
    }
  }
}
