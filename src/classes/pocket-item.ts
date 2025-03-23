import {
  VoidFunction,
  ITilesCoords,
} from '@/types/main-types'
import { PocketItems } from '@/types/enums'

export class PocketItem {

  _type: PocketItems

  _useCallback: VoidFunction
  _dropCallback: VoidFunction

  // coords
  private _coords: ITilesCoords | null = null
  public set coords(numbers: ITilesCoords) {
      this.coords = numbers
      this._pocketSlot = -1
  }
  public get coords(): ITilesCoords | null {
    return this._coords
  }
  //

  // pocketSlot
  private _pocketSlot: number = -1
  public set pocketSlot(slot: number) {
    if (slot > -1) {
      this._pocketSlot = slot
      this._coords = null
    }
  }
  public get pocketSlot(): number {
    return this._pocketSlot
  }
  //

  constructor(
    type: PocketItems,
    useCallback: VoidFunction, dropCallback: VoidFunction,
    coords: ITilesCoords | null,
    slot: number = -1) {

    this._type = type
    if (this.coords) {
      this.coords = coords as ITilesCoords
    }
    if (slot > -1) {
      this.pocketSlot = slot
    }

    this._useCallback = useCallback
    this._dropCallback = dropCallback
  }

  // this item in hand?
  isHand() {
    return this._type == PocketItems.hand && this.pocketSlot > -1
  }

  // this is item in pocket or not?
  isPocket() {
    return this.isHand() || this.pocketSlot > -1
  }

  // if thies item on ground
  isGrounded() {
    return this.coords !== null
  }

  use() {
    if (this.isPocket()) {
      this._useCallback()
    }
  }

  drop() {
    if (this.isPocket()) {
      this._dropCallback()
    }
  }
}
