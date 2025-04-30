
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
    function (dude: Dude) {
      // @ts-ignore
      const that = this as PocketItem
      const envData = dude.envCollisionElementData
      const pocketItemData = dude.pocketItemCollisionData
      if (envData && envData.element.isCorrectToolType(that.type)) {
        envData.element.use(envData.coords, dude)
      } else if (pocketItemData) {
        const pickupItemType = dude._dropItems.pickupItem(pocketItemData.coords)
        if (pickupItemType == null) return

        dude._slotSystem.addItem(pocketItemData.type)

        dude.pocketItemCollisionData = dude._dropItems.getItemDataForActiveItem(pocketItemData.coords)
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
