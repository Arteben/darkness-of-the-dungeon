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
  dropFunc?: (i: PocketItem) => void

  constructor(state: GameState) {
    this._state = state

    for (let i = 0; i < this.maxSlotsNum; i++) {
      this._state.pocketItems[i] = null
    }

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

  onSelectItem(e: CustomEventInit) {
    const idx = e.detail
    if (idx > -1 && idx < this.maxSlotsNum) {
      this._state.selectedPocketItem = idx
    }
  }

  onUseItem(e: CustomEventInit) {
    const idx = e.detail
    if (this._state.selectedPocketItem == idx) {
      this._state.selectedPocketItem = -1
    }
  }

  onTrushItem(e: CustomEventInit) {
    const idx = e.detail
    if (this._state.selectedPocketItem == idx) {
      this._state.selectedPocketItem = -1
    }

    const item = this._state.pocketItems[idx]
    if (item != null && this.dropFunc) {
      this._state.pocketItems[idx] = null
      this.dropFunc(item)
    }
  }
}
