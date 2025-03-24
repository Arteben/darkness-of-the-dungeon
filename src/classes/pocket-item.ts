import {
  VoidFunction,
  IScreenSizes,
} from '@/types/main-types'
import { PocketItems } from '@/types/enums'

export class PocketItem {

  type: PocketItems
  sizes: IScreenSizes
  _useCallback: VoidFunction

  constructor(
    type: PocketItems,
    sizes: IScreenSizes,
    useCallback: VoidFunction) {
    this.type = type
    this._useCallback = useCallback
    this.sizes = sizes
  }

  use() {
      this._useCallback()
  }
}
