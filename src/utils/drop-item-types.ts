
import { PocketItems as PocketItemsEnums } from '@/types/enums'
import { IPocketItemTypes } from '@/types/main-types'
import { PocketItem } from '@/classes/pocket-item'

export const pocketItemTypes: IPocketItemTypes = {
  [PocketItemsEnums.apple]: (new PocketItem(
    PocketItemsEnums.apple,
    { x: 20, y: 20 },
    () => { console.log('you used apple!') })
  )
}
