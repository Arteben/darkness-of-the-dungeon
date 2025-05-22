import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { NullOrGameStateSettings, PocketItemNull } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'

import { BusEventsList, GameStateSettings } from '@/types/enums'

import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

import '@/ui-elements/pocket-slots-item-ui'

@customElement('pocket-slots-ui')
export class PocketSlotsUi extends GameStateElement {

  renderWithGame() {
    const pocketSlots = this._state.pocketItems

    const getPocketSlot = (item: PocketItemNull, idx: number) => {
      if (item) {
        const type = +(item.type)
        const isDropped = item.isDropped
        const isSelected = (this._state.selectedPocketItem == idx)
        const isPlaceble = this._state.isDudeDropAvailable && isSelected && isDropped

        return html`<pocket-slots-item-ui
                  ?isDontDropped="${!isDropped}"
                  ?isPlaceble="${isPlaceble}"
                  ?isSelected="${isSelected}"
                  type=${type}
                  @clickSlotItem="${(e: Event) => { this.onClickPocketItem(e, idx, isSelected) }}"
                  @clickTrashIcon="${(e: Event) => {
                    this.onClickTrushItem(e, idx, isPlaceble)
                  }}"
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

  private onClickTrushItem(e: Event, idx: number, isDropped: boolean) {
    if (isDropped) {
      EventBus.Dispatch(BusEventsList[BusEventsList.trushPocketItem], idx)
    }
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    border: 2px solid #000000;
    background: #303030;
    margin: 0 3px;
  }`
}
