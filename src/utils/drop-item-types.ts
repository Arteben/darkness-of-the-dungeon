
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
      if (that.overlapSomeItem == null) {
        console.log('there is nothing for pick up!!!!!!!!!!!')
      } else {
        const pickupItemType = that._dropItems.pickupItem(that.overlapSomeItem.coords)
        if (pickupItemType == null) return

        that._slotSystem.addItem(that.overlapSomeItem.type)

        that.overlapSomeItem = that._dropItems.getItemDataForActiveItem(that.overlapSomeItem.coords)
      }
    },
    0,
    false,
    { x: 20, y: 20 },
    false,
  ),
}
