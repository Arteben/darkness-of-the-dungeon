import { Physics } from 'phaser'
import {
  IPocketDroppedItemSprites,
  INumberCoords,
  ITilesCoords,
  PocketItemDudeData,
} from '@/types/main-types'
import {
  CheckSymMapElements,
  SceneLevelZIndexes as zIndexes,
} from '@/types/enums'
import { getZerosStringFromNum } from '@/utils/usefull'

import { PocketItem } from '@/classes/pocket-item'
import { MainEngine } from '@/classes/main-engine'
import { MapSceneLevels } from '@/classes/map-scene-levels'

export class DroppedItemsSystem {

  _items: IPocketDroppedItemSprites = {}

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
    return getZerosStringFromNum(coords.x) + getZerosStringFromNum(coords.y)
  }

  makeActiveAndUpShowOnlyLastItem(coordsStr: string) {
    const items = this._items[coordsStr]

    if (!items || items.length == 0) {
      return
    }

    items.forEach((item) => {
      item.setActive(false)
      item.setDepth(zIndexes.pocketItemLevel)
    })
    items[items.length - 1].setActive(true)
    items[items.length - 1].setDepth(zIndexes.pocketItemLevel + 1)
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
    const scaleSize = item.isBig ? 0.9 : 0.6
    child.setOrigin(0.5, 0.5)
    child.setScale(scaleSize)
    child.setSize(item.sizes.x, item.sizes.y)
    child.setDepth(zIndexes.pocketItemLevel)
    child.rotation = item.droppedRotete

    const coordsStr = this.getStringNameForCoords(checkedCoords)
    if (this._items[coordsStr] == undefined) {
      this._items[coordsStr] = [child]
    } else {
      this._items[coordsStr].push(child)
      this.makeActiveAndUpShowOnlyLastItem(coordsStr)
    }

    return true
  }

  itaratePileItems(coords:ITilesCoords) {
    const itemsForCoordsKey = this.getStringNameForCoords(coords)
    const itemsForTile = this._items[itemsForCoordsKey]
    if (itemsForTile.length <= 1) {
      console.error('cant itarate items in ', coords)
      return false
    }

    const firstElement = itemsForTile[0]
    const typeForFirst = firstElement.frame.name
    let counter = 1

    const itarateElementsWithSameType = (pushItem: Physics.Arcade.Sprite) => {
      itemsForTile.push(pushItem)
      itemsForTile.splice(0, 1)
      if (itemsForTile[0].frame.name == typeForFirst) {
        if(counter < itemsForTile.length) {
          counter++
          itarateElementsWithSameType(itemsForTile[0])
        }
      }
    }

    itarateElementsWithSameType(firstElement)
    this.makeActiveAndUpShowOnlyLastItem(itemsForCoordsKey)
    return true
  }

  checkItemInTile(coords: ITilesCoords, type: string) {
    const itemsForTile = this._items[this.getStringNameForCoords(coords)]

    if (!itemsForTile) return false

    const item = itemsForTile.find((_item) => {
      return _item.frame.name == type
    })

    return item != undefined
  }

  getItemDataForActiveItem(itemsCoord: ITilesCoords): PocketItemDudeData {
    const itemsForCoordsKey = this.getStringNameForCoords(itemsCoord)
    const items = this._items[itemsForCoordsKey]
    if (items == undefined || items.length == 0) {
      return null
    }

    const isOtherTypes = (checkedItems: Physics.Arcade.Sprite[]) => {
      const firstType = checkedItems[0].frame.name
      for (let i = 1; i < checkedItems.length; i++) {
        if (firstType != checkedItems[i].frame.name) {
          return true
        }
      }
      return false
    }

    const type = items[items.length - 1].frame.name
    const cycled = items.length > 1 && isOtherTypes(items)
    return {
      type, coords: itemsCoord, cycled,
    }

  }

  pickupItem(itemsCoord: ITilesCoords): string | null {
    const itemsForCoordsKey = this.getStringNameForCoords(itemsCoord)
    const itemsForTile = this._items[itemsForCoordsKey]
    if (itemsForTile == undefined || itemsForTile.length == 0) {
      console.error('cant active item in pickupItem!', itemsForTile)
      return null
    }
    // delete item from scene
    const lastActiveItem = itemsForTile[itemsForTile.length - 1]
    const pickupItemType = lastActiveItem.frame.name
    lastActiveItem.destroy(true)
    itemsForTile.splice(itemsForTile.length - 1, 1)

    if (itemsForTile.length == 0) {
      delete this._items[itemsForCoordsKey]
    } else {
      this.makeActiveAndUpShowOnlyLastItem(itemsForCoordsKey)
    }
    return pickupItemType
  }
}
