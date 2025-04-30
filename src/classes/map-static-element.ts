import { PocketItems } from '@/types/enums'
import { ITilesCoords } from '@/types/main-types'

import { Dude } from '@/classes/dude'

type callbackFunc = (a: ITilesCoords, b: Dude) => void

export class MapStaticElement {
  toolType: PocketItems
  iconTip: number
  // @ts-ignore
  isInteractive: boolean
  _useCallback: callbackFunc


  constructor(
    tip: number,
    callback: (a: ITilesCoords, b: Dude) => void,
    pocketItemType: PocketItems = PocketItems.hand,
    isActive: boolean = true,
  ) {
    this.iconTip = tip
    this._useCallback = callback
    this.toolType = pocketItemType
    this.setInteractive(isActive)
  }

  setInteractive(flag: boolean) {
    this.isInteractive = flag
  }

  use(coords: ITilesCoords, char: Dude) {
    this._useCallback(coords, char)
  }

  isCorrectToolType(type: PocketItems) {
    return this.toolType == type
  }
}
