import { IScreenSizes } from '@/types/main-types'
import { PocketItems } from '@/types/enums'

import { Dude } from './dude'

type callbackType = (a: Dude) => void

export class PocketItem {

  type: PocketItems
  sizes: IScreenSizes
  isBig: boolean
  isDropped: boolean
  droppedRotete: number
  _useCallback: callbackType

  constructor(
    type: PocketItems,
    useCallback: callbackType,
    rotates: number = 0,
    isBig: boolean = false,
    sizes: IScreenSizes = { x: 20, y: 20 },
    isDropped: boolean = true
  ) {
    this.type = type
    this._useCallback = useCallback
    this.sizes = sizes
    this.isBig = isBig
    this.isDropped = isDropped
    this.droppedRotete = rotates
  }

  use(dude: Dude) {
    this._useCallback(dude)
  }
}
