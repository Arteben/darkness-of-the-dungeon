import {
  EnvStaticElements,
  PocketItemsEnum,
} from '@/types/enums'

import {
  IEnvElementTypes,
  DroppedItemsList,
  StaticEnvElementCallback,
} from '@/types/main-types'

import { getRandomIntNumber } from '@/utils/usefull'

import { boxDroppedItems } from '@/utils/drop-item-types'

import { MapStaticElement, BoxStaticElement } from '@/classes/map-static-element'

export const createListOfStaticElements = (tileLayer: Phaser.Tilemaps.TilemapLayer) => {

  const createUsualBoxesElement = (list: DroppedItemsList = boxDroppedItems) => {
    const time = getRandomIntNumber(2, 5)
    return new BoxStaticElement(tileLayer, 168, time, list)
  }

  const createStaticElementWithLayer = (
    tip: number,
    callback: StaticEnvElementCallback,
    time: number = 1,
    pocketItemType: PocketItemsEnum = PocketItemsEnum.hand,
  ) => {
    return new MapStaticElement(
      tileLayer,
      tip,
      callback,
      time,
      pocketItemType,
    )
  }

  return {
    [EnvStaticElements.box]: createUsualBoxesElement(),
    [EnvStaticElements.bigBox]: createUsualBoxesElement(),
    [EnvStaticElements.barrels]: createUsualBoxesElement(),
    [EnvStaticElements.bigBarrel]: createUsualBoxesElement(),
    [EnvStaticElements.chest]: createUsualBoxesElement(),
    [EnvStaticElements.door]: createStaticElementWithLayer(
      15,
      () => { console.log('you open the door') },
      2,
      PocketItemsEnum.key,
    ),
    [EnvStaticElements.torch]: createStaticElementWithLayer(
      170,
      () => { console.log('you create a fire!') },
    ),
  } as IEnvElementTypes
}
