import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { PocketItemNull } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'

import { BusEventsList } from '@/types/enums'

import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

import '@/ui-elements/pocket-slots-item-ui'

@customElement('pocket-slots-ui')
export class PocketSlotsUi extends GameStateElement {

  render() {
    if (!this._game) return

    const pocketSlots = this._state.pocketItems

    const getPocketSlot = (item: PocketItemNull, idx: number) => {
      if (item) {
        const type = +(item.type)
        const isDropped = item.isDropped
        const isSelected = (this._state.selectedPocketItem == idx)

        return html`<pocket-slots-item-ui
                  ?isDontDropped="${!isDropped}"
                  ?isSelected="${isSelected}"
                  type=${type}
                  @clickSlotItem="${(e: Event) => { this.onClickPocketItem(e, idx, isSelected) }}"
                  @clickTrushItem="${(e: Event) => { this.onClickTrushItem(e, idx) }}"
                ></pocket-slots-item-ui>`
      } else {
        return html`<pocket-slots-item-ui></pocket-slots-item-ui>`
      }
    }

    return html`${pocketSlots.map((_item, idx) => getPocketSlot(_item, idx))}`
  }

  private onClickPocketItem(e: Event, idx: number, isSelected: boolean) {
    if (isSelected) {
      EventBus.Dispatch(BusEventsList[BusEventsList.usePocketItem], idx)
    } else {
      EventBus.Dispatch(BusEventsList[BusEventsList.selectPocketItem], idx)
    }
  }

  private onClickTrushItem(e: Event, idx: number) {
    EventBus.Dispatch(BusEventsList[BusEventsList.trushPocketItem], idx)
  }

  static styles = css`
  :host {
      display: flex;
      flex-direction: row;
      flex-grow: 1;
      justify-content: space-evenly;
      max-width: 340px;
      border: 1px solid #000000;
      background: #303030;
  }`
}
