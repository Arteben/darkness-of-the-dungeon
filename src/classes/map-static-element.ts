import {
  VoidFunction,
  IScreenSizes,
} from '@/types/main-types'

import { PocketItems } from '@/types/enums'

export class MapStaticElement {
  toolType: PocketItems
  iconTip: number

  constructor(
    tip: number,
    pocketItemType: PocketItems = PocketItems.hand
  ) {
    this.iconTip = tip
    this.toolType = pocketItemType
  }
}
