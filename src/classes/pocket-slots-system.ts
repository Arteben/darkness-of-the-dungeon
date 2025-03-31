import { PocketItems as PocketItemsEnums } from '@/types/enums'

import { PocketItem } from '@/classes/pocket-item'
import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'

import { pocketItemTypes } from '@/utils/drop-item-types'

export class PocketSlotsSystem {

  _items: PocketItem[] = []
  _state: GameState
  maxSlotsNum: number = 5

  constructor(state: GameState) {
    this._state = state
  }

  isFullSlots() {
    return this._state.pocketItems.length >= this.maxSlotsNum
  }

  addHandItem() {
    this.addItem(String(PocketItemsEnums.hand))
  }

  addItem(typeItem: string) {
    const item = pocketItemTypes[typeItem]

    const items = this._state.pocketItems
    if (this.maxSlotsNum > items.length) {
      items.push(item)
      this._state.pocketItems = items
    }
  }
}
