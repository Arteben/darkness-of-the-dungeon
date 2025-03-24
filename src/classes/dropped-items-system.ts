import { Physics } from 'phaser'
import { IPocketItem, VoidFunction, INumberCoords, ITilesCoords } from '@/types/main-types'
import { PocketItems } from '@/types/enums'

import { PocketItem } from '@/classes/pocket-item'
import { MainEngine } from '@/classes/main-engine'
import { MapSceneLevels } from '@/classes/map-scene-levels'

export class DroppedItemsSystem {

  _items: PocketItem[] = []
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

  getCoordsFromTilePos({x, y}: ITilesCoords) : INumberCoords{
    const w = (x + 0.5) * this._levels._tileWidth
    const h = (y - 0.5) * this._levels._tileWidth
    return {w, h}
  }

  // drop some item on ground
  drop(coords: ITilesCoords, item: PocketItem) {
    const pos = this.getCoordsFromTilePos(coords)
    const child = this._group.create(pos.w, pos.h, this._key, item._type)
    // setted visible for this item
    child.setScale(0.7, 0.7)
    child.setSize(20, 20)
    child.setOrigin(0.5, 0.5)
    this._items.push(item)
  }

  drawItems() {
  }
}
