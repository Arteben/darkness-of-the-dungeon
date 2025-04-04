import {
  PocketItems as PocketItemsEnums,
  BusEventsList,
} from '@/types/enums'

import { GameState } from '@/classes/game-state'
import { EventBus } from '@/classes/event-bus'
import { PocketItem } from '@/classes/pocket-item'

import { pocketItemTypes } from '@/utils/drop-item-types'

export class PocketSlotsSystem {
  _state: GameState
  maxSlotsNum: number = 5
  dropFunc?: (i: PocketItem) => boolean
  useFunc?: (i: PocketItem) => void
  calcAvailableDrop?: () => void

  public get selectedItem() {
    const idx = this._state.selectedPocketItem
    const item = this._state.pocketItems[idx]
    if (item) {
      return item
    } else {
      return null
    }
  }

  constructor(state: GameState) {
    this._state = state

    for (let i = 0; i < this.maxSlotsNum; i++) {
      this._state.pocketItems[i] = null
    }

    this.addHandItem()
    this.selectHand()

    EventBus.On(BusEventsList[BusEventsList.selectPocketItem], (event: CustomEventInit) => {
      this.onSelectItem(event)
    })

    EventBus.On(BusEventsList[BusEventsList.usePocketItem], (event: CustomEventInit) => {
      this.onUseItem(event)
    })

    EventBus.On(BusEventsList[BusEventsList.trushPocketItem], (event: CustomEventInit) => {
      this.onTrushItem(event)
    })
  }

  isFullSlots() {
    let emptyCounter = 0
    this._state.pocketItems.forEach(item => {
      if (item == null) emptyCounter++
    })
    return emptyCounter == 0
  }

  addHandItem() {
    this.addItem(String(PocketItemsEnums.hand))
  }

  addItem(typeItem: string) {
    const added = pocketItemTypes[typeItem]

    const items = this._state.pocketItems
    for (let i = 0; i < this.maxSlotsNum; i++) {
      if (items[i] == null) {
        items[i] = added
        this._state.pocketItems = [...items]
        return
      }
    }
  }

  selectHand() {
    const defaultIdx = 0
    if (this._state.pocketItems[defaultIdx]) {
      this.onSelectItem({ detail: defaultIdx } as CustomEventInit)
    }
  }

  onSelectItem(e: CustomEventInit) {
    const idx = e.detail
    const items = this._state.pocketItems
    if (idx > -1 && idx < items.length && items[idx] != null) {
      this._state.selectedPocketItem = idx
      if (this.calcAvailableDrop) {
        this.calcAvailableDrop()
      }
    }
  }

  onUseItem(e: CustomEventInit) {
    const item = this.selectedItem
    if (item != null && this.useFunc) {
      this.useFunc(item)
    }
  }

  onTrushItem(e: CustomEventInit) {
    const idx = e.detail
    const item = this._state.pocketItems[idx]

    if (!(item != null && item == this.selectedItem
      && item.isDropped && this.dropFunc)) return

    if (this.dropFunc(item)) {
      this._state.pocketItems[idx] = null
      this.selectHand()
    } else {
      console.log('cant trash this item!')
    }
  }

  nextPocketItem() {
    const idx = this._state.selectedPocketItem
    let inc = 1
    const items = this._state.pocketItems
    let newIdx = 0

    const getNextSelectable = () => {
      if (idx + inc < items.length) {
        if (items[idx + inc] == null) {
          inc++
          getNextSelectable()
        } else {
          newIdx = idx + inc
        }
      }
    }

    getNextSelectable()

    this.onSelectItem({detail: newIdx} as CustomEventInit)
  }

  setDudeDropAvailable(flag: boolean) {
    this._state.isDudeDropAvailable = flag
  }
}
