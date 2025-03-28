import {
  VoidFunction,
  IScreenSizes,
} from '@/types/main-types'
import { PocketItems } from '@/types/enums'

export class PocketItem {

  type: PocketItems
  sizes: IScreenSizes
  isBig: boolean
  _useCallback: VoidFunction

  constructor(
    type: PocketItems,
    useCallback: VoidFunction,
    isBig: boolean = false,
    sizes: IScreenSizes = { x: 20, y: 20 },
  ) {
    this.type = type
    this._useCallback = useCallback
    this.sizes = sizes
    this.isBig = isBig
  }

  use() {
    this._useCallback()
  }
}
