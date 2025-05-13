import {
  EnvStaticElements,
  PocketItems,
} from '@/types/enums'

import {
  IEnvElementTypes,
  DroppedItemsList,
  StaticEnvElementCallback,
} from '@/types/main-types'

import { getRandomIntNumber } from '@/utils/usefull'

import { MapStaticElement, BoxStaticElement } from '@/classes/map-static-element'

export const createListOfStaticElements = (tileLayer: Phaser.Tilemaps.TilemapLayer) => {

  const createUsualBoxesElement = (list: DroppedItemsList = []) => {
    const time = getRandomIntNumber(2, 5)
    return new BoxStaticElement(tileLayer, 168, time, list)
  }

  const createStaticElementWithLayer = (
    tip: number,
    callback: StaticEnvElementCallback,
    time: number = 1,
    pocketItemType: PocketItems = PocketItems.hand,
  ) => {
    return new MapStaticElement(
      tileLayer,
      tip,
      callback,
      time,
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
      2,
      PocketItems.key,
    ),
    [EnvStaticElements.torch]: createStaticElementWithLayer(
      170,
      () => { console.log('you create a fire!') },
    ),
  } as IEnvElementTypes
}
