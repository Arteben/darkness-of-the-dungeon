import { PocketItems } from '@/types/enums'

export class MapStaticElement {
  toolType: PocketItems
  iconTip: number
  // @ts-ignore
  isInteractive: boolean

  constructor(
    tip: number,
    pocketItemType: PocketItems = PocketItems.hand,
    isActive: boolean = true,
  ) {
    this.iconTip = tip
    this.toolType = pocketItemType
    this.setInteractive(isActive)
  }

  setInteractive(flag: boolean) {
    this.isInteractive = flag
  }
}
