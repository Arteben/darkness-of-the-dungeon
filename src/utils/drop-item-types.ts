
import {
  PocketItemsEnum,
  UserNotificationTypes,
} from '@/types/enums'

import {
  IPocketItemTypes,
  DroppedItemsList,
} from '@/types/main-types'

import { PocketItem } from '@/classes/pocket-item'
import { Dude } from '@/classes/dude'

const translatesDroppedItemKey = 'droppedItemAction'

const getNotesForNoIteractiveItems = (item: PocketItemsEnum, char: Dude) => {
  const translate = char.userModals.argsLoc(
    translatesDroppedItemKey + 'Item', ['droppedItem' + PocketItemsEnum[item]])

  return {
    type: UserNotificationTypes.error,
    text: translate,
  }
}

export const pocketItemTypes: IPocketItemTypes = {
  [PocketItemsEnum.apple]: new PocketItem(
    PocketItemsEnum.apple,
    { x: 15, y: 15 },
    () => { console.log('you used apple!') },
  ),
  [PocketItemsEnum.key]: new PocketItem(
    PocketItemsEnum.key,
    { x: 10, y: 10 },
    () => { console.log('you used the key!') },
    false,
    0.8,
  ),
  [PocketItemsEnum.hand]: new PocketItem(
    PocketItemsEnum.hand,
    { x: 20, y: 20 },
    function (dude: Dude) {
      // @ts-ignore
      const that = this as PocketItem
      const envData = dude.envCollisionElementData
      const pocketItemData = dude.pocketItemCollisionData
      if (envData && envData.isCorrectToolType(that.type)) {
        envData.use(dude)
      } else if (pocketItemData) {
        const pickupItemType = dude.dropItems.pickupItem(pocketItemData.coords)
        if (pickupItemType == null) return

        dude._slotSystem.addItem(pocketItemData.type)

        dude.pocketItemCollisionData = dude.dropItems.getItemDataForActiveItem(pocketItemData.coords)
      } else {
        dude.userModals.showNotification({
          type: UserNotificationTypes.error,
          text: dude.userModals.loc(
            translatesDroppedItemKey + PocketItemsEnum[that.type]),
        })
      }
    },
    false,
    0,
    false,
  ),
  [PocketItemsEnum.rock]: new PocketItem(
    PocketItemsEnum.rock,
    { x: 15, y: 15 },
    function (dude: Dude) {
      // @ts-ignore
      const that = this as PocketItem
      dude.userModals.showNotification(getNotesForNoIteractiveItems(that.type, dude))
    },
  ),
  [PocketItemsEnum.smolBranch]: new PocketItem(
    PocketItemsEnum.smolBranch,
    { x: 10, y: 10 },
    function () { },
    true,
    0.75,
  ),
}

export const boxDroppedItems: DroppedItemsList = [
  pocketItemTypes[PocketItemsEnum.apple],
  pocketItemTypes[PocketItemsEnum.rock],
]
