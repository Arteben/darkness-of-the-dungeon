import {
  EnvStaticElements as EnvElmts,
  PocketItemsEnum,
  DudeActionSounds,
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
import { Dude } from '@/classes/dude'

import { pocketItemTypes } from '@/utils/drop-item-types'

export class EnvStaticMapElementTypes {
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
        EnvStaticMapElementTypes.GetIndexForStaticElement(findedType, { x: tile.x, y: tile.y })

      this.elementsList[indexForElement] = listOfTypesElements[findedType]({ x: tile.x, y: tile.y })
    })
  }

  getCreaterUsualBoxesElement(
    tile: EnvElmts,
    openedBoxTile: EnvElmts,
    isAlwaysFull: boolean,
    list: DroppedItemsList = boxDroppedItems,
    searchSound?: DudeActionSounds
  ) {
    return (coords: ITilesCoords) => {
      return new BoxStaticElement(this, tile, openedBoxTile, coords, 168, list, isAlwaysFull, searchSound)
    }
  }

  getCreaterStaticElementWithLayer(
    tileIndex: EnvElmts,
    noInterTileIndex: EnvElmts,
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
        undefined,
        pocketItemType,
      )
    }
  }

  getListOfElementTypes(): IEnvElementTypes {
    return {
      [EnvElmts.box]: this.getCreaterUsualBoxesElement(EnvElmts.box, EnvElmts.openedBox, false),
      [EnvElmts.bigBox]: this.getCreaterUsualBoxesElement(EnvElmts.bigBox, EnvElmts.openedBigBox, false),
      [EnvElmts.barrels]: this.getCreaterUsualBoxesElement(EnvElmts.barrels, EnvElmts.openedBarrels, false),
      [EnvElmts.bigBarrel]: this.getCreaterUsualBoxesElement(EnvElmts.bigBarrel, EnvElmts.openedBigBarrel, false),
      [EnvElmts.chest]: this.getCreaterUsualBoxesElement(
        EnvElmts.chest, EnvElmts.openedChest, true, [pocketItemTypes[PocketItemsEnum.key]], DudeActionSounds.searchChest),
      [EnvElmts.fire]: this.getCreaterUsualBoxesElement(
        EnvElmts.fire, EnvElmts.extFire, true, [pocketItemTypes[PocketItemsEnum.smolBranch]], DudeActionSounds.searchCampfire),
      [EnvElmts.door]: this.getCreaterStaticElementWithLayer(
        EnvElmts.door,
        EnvElmts.door,
        15,
        function (this: MapStaticElement, coords: ITilesCoords, char: Dude) {
          char.scopeEndGame.showEndGameUserModal()
        },
        2,
        PocketItemsEnum.key,
      ),
      [EnvElmts.torch]: this.getCreaterStaticElementWithLayer(
        EnvElmts.torch,
        EnvElmts.torch,
        170,
        function (this: MapStaticElement) {
          this.setInteractive(false)
        },
      ),
    }
  }

  pushNewElement(
    coords: ITilesCoords, newTile: EnvElmts, oldTile: EnvElmts) {
    const getElementIdx = EnvStaticMapElementTypes.GetIndexForStaticElement
    const element = this.elementsList[getElementIdx(String(oldTile), coords)]

    if (!element) {
      return false
    }

    delete this.elementsList[getElementIdx(String(oldTile), coords)]
    this.elementsList[getElementIdx(String(newTile), coords)] = element
    return true
  }

  static GetIndexForStaticElement(type: string, coords: ITilesCoords) {
    return type + getZerosStringFromNum(coords.x) + getZerosStringFromNum(coords.y)
  }

  changeLayerTile(coords: ITilesCoords, newTile: EnvElmts) {
    this._tilesLayer.putTileAt(newTile, coords.x, coords.y)
  }
}
