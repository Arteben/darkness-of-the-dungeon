import {
  VoidFunction,
} from '@/types/main-types'
import { PocketItems } from '@/types/enums'

export class PocketItem {

  _type: PocketItems
  _useCallback: VoidFunction

  constructor(
    type: PocketItems,
    useCallback: VoidFunction) {
    this._type = type
    this._useCallback = useCallback
  }

  use() {
      this._useCallback()
  }
}
