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

import { getRandomIntNumber } from '@/utils/usefull'
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
        EnvStaticMapElements.GetIndexForStaticElement(findedType, {x: tile.x, y: tile.y})

      this.elementsList[indexForElement] = listOfTypesElements[findedType]()
    })
  }

  getCreaterUsualBoxesElement(list: DroppedItemsList = boxDroppedItems) {
    const time = getRandomIntNumber(2, 5)
    return () => {
      return new BoxStaticElement(this._tilesLayer, 168, time, list)
    }
  }

  getCreaterStaticElementWithLayer(
    tip: number,
    callback: StaticEnvElementCallback,
    time: number = 1,
    pocketItemType: PocketItemsEnum = PocketItemsEnum.hand,
  ) {
    return () => {
      return new MapStaticElement(
        this._tilesLayer,
        tip,
        callback,
        time,
        pocketItemType,
      )
    }
  }

  getListOfElementTypes(): IEnvElementTypes {
    return {
      [EnvStaticElements.box]: this.getCreaterUsualBoxesElement(),
      [EnvStaticElements.bigBox]: this.getCreaterUsualBoxesElement(),
      [EnvStaticElements.barrels]: this.getCreaterUsualBoxesElement(),
      [EnvStaticElements.bigBarrel]: this.getCreaterUsualBoxesElement(),
      [EnvStaticElements.chest]: this.getCreaterUsualBoxesElement(),
      [EnvStaticElements.door]: this.getCreaterStaticElementWithLayer(
        15,
        () => { console.log('you open the door') },
        2,
        PocketItemsEnum.key,
      ),
      [EnvStaticElements.torch]: this.getCreaterStaticElementWithLayer(
        170,
        () => { console.log('you create a fire!') },
      ),
    }
  }

  static GetIndexForStaticElement(type: string, coords: ITilesCoords) {
    return type + getZerosStringFromNum(coords.x) + getZerosStringFromNum(coords.y)
  }
}
