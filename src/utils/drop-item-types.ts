
import { PocketItems as PocketItemsEnums } from '@/types/enums'
import { IPocketItemTypes } from '@/types/main-types'
import { PocketItem } from '@/classes/pocket-item'

export const pocketItemTypes: IPocketItemTypes = {
  [PocketItemsEnums.apple]: new PocketItem(
    PocketItemsEnums.apple,
    () => { console.log('you used apple!') },
  ),
  [PocketItemsEnums.key]: new PocketItem(
    PocketItemsEnums.key,
    () => { console.log('you used the key!') },
  ),
  [PocketItemsEnums.sword]: new PocketItem(
    PocketItemsEnums.sword,
    () => { console.log('you used the key!') },
    true,
  ),
  [PocketItemsEnums.hand]: new PocketItem(
    PocketItemsEnums.hand,
    () => { console.log('you used the key!') },
    false,
    { x: 20, y: 20 },
    true
  ),
}
