import {
  EnvStaticElements,
  PocketItems,
} from '@/types/enums'

import {
  IEnvElementTypes,
  DroppedItemsList,
  StaticEnvElementCallback,
} from '@/types/main-types'

import { MapStaticElement, BoxStaticElement } from '@/classes/map-static-element'

export const createListOfStaticElements = (tileLayer: Phaser.Tilemaps.TilemapLayer) => {

  const createUsualBoxesElement = (list: DroppedItemsList = []) => {
    return new BoxStaticElement(tileLayer, 168, list)
  }

  const createStaticElementWithLayer = (
    tip: number,
    callback: StaticEnvElementCallback,
    pocketItemType: PocketItems = PocketItems.hand,
  ) => {
    return new MapStaticElement(
      tileLayer,
      tip,
      callback,
      pocketItemType,
    )
  }

  const boxes = createUsualBoxesElement()

  return {
    [EnvStaticElements.box]: boxes,
    [EnvStaticElements.bigBox]: boxes,
    [EnvStaticElements.barrels]: boxes,
    [EnvStaticElements.bigBarrel]: boxes,
    [EnvStaticElements.chest]: createUsualBoxesElement(),
    [EnvStaticElements.door]: createStaticElementWithLayer(
      15,
      () => { console.log('you open the door') },
      PocketItems.key,
    ),
    [EnvStaticElements.torch]: createStaticElementWithLayer(
      170,
      () => { console.log('you create a fire!') },
    ),
  } as IEnvElementTypes
}
