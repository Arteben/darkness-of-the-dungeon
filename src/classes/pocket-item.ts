import { IScreenSizes } from '@/types/main-types'
import {
  PocketItemsEnum,
  DudeActionSounds,
} from '@/types/enums'

import { Dude } from './dude'

type callbackType = (a: Dude) => void

export class PocketItem {

  type: PocketItemsEnum
  sizes: IScreenSizes
  isBig: boolean
  isDropped: boolean
  droppedRotete: number
  _useCallback: callbackType
  pickupSound: DudeActionSounds

  constructor(
    type: PocketItemsEnum,
    sizes: IScreenSizes = { x: 20, y: 20 },
    useCallback: callbackType = function (a: Dude) {},
    isBig: boolean = false,
    rotates: number = 0,
    pickupSound: DudeActionSounds = DudeActionSounds.getItem,
    isDropped: boolean = true
  ) {
    this.type = type
    this._useCallback = useCallback
    this.sizes = sizes
    this.isBig = isBig
    this.isDropped = isDropped
    this.droppedRotete = rotates
    this.pickupSound = pickupSound
  }

  use(dude: Dude) {
    this._useCallback(dude)
  }
}
