import {
  EnvStaticElements,
  PocketItemsEnum,
} from '@/types/enums'

import {
  IEnvElementTypes,
  DroppedItemsList,
  StaticEnvElementCallback,
  ITilesCoords,
  IListOFEnvStaticElements,
} from '@/types/main-types'
import { getZerosStringFromNum } from '@/utils/usefull'

import { boxDroppedItems } from '@/utils/drop-item-types'
import { MapStaticElement, BoxStaticElement } from '@/classes/map-static-element'

export class EnvStaticMapElements {
  _tilesLayer: Phaser.Tilemaps.TilemapLayer
  elementsList: IListOFEnvStaticElements = {}

  constructor(layer: Phaser.Tilemaps.TilemapLayer) {
    this._tilesLayer = layer

    const listOfTypesElements = this.getListOfElementTypes()
    const listOfTypes = Object.keys(listOfTypesElements)

    this._tilesLayer.forEachTile((tile: Phaser.Tilemaps.Tile) => {
      if (tile.index == -1) return

      const stringIndex = String(tile.index)
      const findedType = listOfTypes.find(type => type == stringIndex) as string

      if (!findedType) return

      const indexForElement =
        EnvStaticMapElements.GetIndexForStaticElement(findedType, { x: tile.x, y: tile.y })

      this.elementsList[indexForElement] = listOfTypesElements[findedType]({ x: tile.x, y: tile.y })
    })
  }

  getCreaterUsualBoxesElement(
    tile: EnvStaticElements, openedBoxTile: EnvStaticElements, list: DroppedItemsList = boxDroppedItems) {
    return (coords: ITilesCoords) => {
      return new BoxStaticElement(this, tile, openedBoxTile, coords, 168, list)
    }
  }

  getCreaterStaticElementWithLayer(
    tileIndex: EnvStaticElements,
    noInterTileIndex: EnvStaticElements,
    tip: number,
    callback: StaticEnvElementCallback,
    time: number = 1,
    pocketItemType: PocketItemsEnum = PocketItemsEnum.hand,
  ) {
    return (coords: ITilesCoords) => {
      return new MapStaticElement(
        this,
        tileIndex,
        noInterTileIndex,
        coords,
        tip,
        callback,
        time,
        pocketItemType,
      )
    }
  }

  getListOfElementTypes(): IEnvElementTypes {
    return {
      [EnvStaticElements.box]: this.getCreaterUsualBoxesElement(EnvStaticElements.box, EnvStaticElements.usedBox),
      [EnvStaticElements.bigBox]: this.getCreaterUsualBoxesElement(EnvStaticElements.bigBox, EnvStaticElements.usedBox),
      [EnvStaticElements.barrels]: this.getCreaterUsualBoxesElement(EnvStaticElements.barrels, EnvStaticElements.usedBox),
      [EnvStaticElements.bigBarrel]: this.getCreaterUsualBoxesElement(EnvStaticElements.bigBarrel, EnvStaticElements.usedBox),
      [EnvStaticElements.chest]: this.getCreaterUsualBoxesElement(EnvStaticElements.chest, EnvStaticElements.usedBox),
      [EnvStaticElements.door]: this.getCreaterStaticElementWithLayer(
        EnvStaticElements.door,
        EnvStaticElements.usedBox,
        15,
        () => { console.log('you open the door') },
        2,
        PocketItemsEnum.key,
      ),
      [EnvStaticElements.torch]: this.getCreaterStaticElementWithLayer(
        EnvStaticElements.torch,
        EnvStaticElements.torch,
        170,
        (that: MapStaticElement) => {
          that.setInteractive(false)
          console.log('you create a fire!')
        },
      ),
    }
  }

  static GetIndexForStaticElement(type: string, coords: ITilesCoords) {
    return type + getZerosStringFromNum(coords.x) + getZerosStringFromNum(coords.y)
  }

  changeLayerTile(coords: ITilesCoords, newTile: EnvStaticElements) {
    this._tilesLayer.putTileAt(newTile, coords.x, coords.y)
  }
}
