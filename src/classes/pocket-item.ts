import {
  VoidFunction,
  IScreenSizes,
} from '@/types/main-types'
import { PocketItems } from '@/types/enums'

export class PocketItem {

  type: PocketItems
  sizes: IScreenSizes
  isBig: boolean
  dontDropped: boolean
  _useCallback: VoidFunction

  constructor(
    type: PocketItems,
    useCallback: VoidFunction,
    isBig: boolean = false,
    sizes: IScreenSizes = { x: 20, y: 20 },
    dontDropped: boolean = false
  ) {
    this.type = type
    this._useCallback = useCallback
    this.sizes = sizes
    this.isBig = isBig
    this.dontDropped = dontDropped
  }

  use() {
    this._useCallback()
  }
}
