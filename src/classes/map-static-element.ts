import { PocketItems } from '@/types/enums'
import {
  ITilesCoords,
  DroppedItemsList,
  StaticEnvElementCallback,
} from '@/types/main-types'

import { Dude } from '@/classes/dude'

export class MapStaticElement {
  toolType: PocketItems
  iconTip: number
  // @ts-ignore
  isInteractive: boolean
  _useCallback: StaticEnvElementCallback
  _tileLayer: Phaser.Tilemaps.TilemapLayer


  constructor(
    layer: Phaser.Tilemaps.TilemapLayer,
    tip: number,
    callback: StaticEnvElementCallback,
    pocketItemType: PocketItems = PocketItems.hand,
  ) {
    this._tileLayer = layer
    this.iconTip = tip
    this._useCallback = callback
    this.toolType = pocketItemType
    this.setInteractive(true)
  }

  setInteractive(flag: boolean) {
    this.isInteractive = flag
  }

  use(coords: ITilesCoords, char: Dude) {
    this._useCallback(coords, char)
  }

  isCorrectToolType(type: PocketItems) {
    return this.toolType == type
  }
}

export class BoxStaticElement extends MapStaticElement {
  constructor(layer: Phaser.Tilemaps.TilemapLayer, tip: number, list: DroppedItemsList) {
    const callback = (coords: ITilesCoords, char: Dude) => { console.log('special class for search box!!!!!!!!', coords, Dude) }
    super(layer, tip, callback)
  }
}
