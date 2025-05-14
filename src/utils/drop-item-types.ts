
import { PocketItemsEnum } from '@/types/enums'
import {
  IPocketItemTypes,
  DroppedItemsList,
} from '@/types/main-types'

import { PocketItem } from '@/classes/pocket-item'
import { Dude } from '@/classes/dude'

export const pocketItemTypes: IPocketItemTypes = {
  [PocketItemsEnum.apple]: new PocketItem(
    PocketItemsEnum.apple,
    () => { console.log('you used apple!') },
  ),
  [PocketItemsEnum.key]: new PocketItem(
    PocketItemsEnum.key,
    () => { console.log('you used the key!') },
    0.8,
    false,
    { x: 10, y: 10 },
  ),
  [PocketItemsEnum.sword]: new PocketItem(
    PocketItemsEnum.sword,
    () => { console.log('you used sword!') },
    0.9,
    true,
    { x: 10, y: 10 },
  ),
  [PocketItemsEnum.hand]: new PocketItem(
    PocketItemsEnum.hand,
    function (dude: Dude) {
      // @ts-ignore
      const that = this as PocketItem
      const envData = dude.envCollisionElementData
      const pocketItemData = dude.pocketItemCollisionData
      if (envData && envData.element.isCorrectToolType(that.type)) {
        envData.element.use(envData.coords, dude)
      } else if (pocketItemData) {
        const pickupItemType = dude.dropItems.pickupItem(pocketItemData.coords)
        if (pickupItemType == null) return

        dude._slotSystem.addItem(pocketItemData.type)

        dude.pocketItemCollisionData = dude.dropItems.getItemDataForActiveItem(pocketItemData.coords)
      } else {
        console.warn('You want to do with you hand, but there is nothing!')
      }
    },
    0,
    false,
    { x: 20, y: 20 },
    false,
  ),
}

export const boxDroppedItems: DroppedItemsList = [
  pocketItemTypes[PocketItemsEnum.key],
  pocketItemTypes[PocketItemsEnum.apple],
  pocketItemTypes[PocketItemsEnum.sword],
]
