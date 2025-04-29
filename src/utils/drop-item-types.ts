
import { PocketItems as PocketItemsEnums } from '@/types/enums'
import { IPocketItemTypes } from '@/types/main-types'
import { PocketItem } from '@/classes/pocket-item'
import { Dude } from '@/classes/dude'

export const pocketItemTypes: IPocketItemTypes = {
  [PocketItemsEnums.apple]: new PocketItem(
    PocketItemsEnums.apple,
    () => { console.log('you used apple!') },
  ),
  [PocketItemsEnums.key]: new PocketItem(
    PocketItemsEnums.key,
    () => { console.log('you used the key!') },
    0.8,
    false,
    { x: 10, y: 10 },
  ),
  [PocketItemsEnums.sword]: new PocketItem(
    PocketItemsEnums.sword,
    () => { console.log('you used sword!') },
    0.9,
    true,
    { x: 10, y: 10 },
  ),
  [PocketItemsEnums.hand]: new PocketItem(
    PocketItemsEnums.hand,
    function () {
      // @ts-ignore
      const that = this as Dude
      const envData = that.envCollisionElementData
      const pocketItemData = that.pocketItemCollisionData
      if (envData) {
        envData.element.use(envData.coords, that)
      } else if (pocketItemData) {
        const pickupItemType = that._dropItems.pickupItem(pocketItemData.coords)
        if (pickupItemType == null) return

        that._slotSystem.addItem(pocketItemData.type)

        that.pocketItemCollisionData = that._dropItems.getItemDataForActiveItem(pocketItemData.coords)
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
