import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { PocketItem } from '@/classes/pocket-item'

import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

import '@/ui-elements/pocket-slots-item-ui'

@customElement('pocket-slots-ui')
export class PocketSlotsUi extends GameStateElement {

  render() {
    if (!this._game) return

    const pocketSlots = new Array(this._game.maxSlots)
    const items = this._state.pocketItems
    for(let idx = 0; idx < pocketSlots.length; idx++) {
      if (items[idx]) {
        pocketSlots[idx] = items[idx]
      } else {
        pocketSlots[idx] = null
      }
    }

    const getPocketSlot = (item: PocketItem | undefined) => {
      let type = -1
      let isDropped: boolean = true

      if (item) {
        type = +(item.type)
        isDropped = item.isDropped
      }

      return html`<pocket-slots-item-ui
                    ?isDontDropped="${!isDropped}"
                    type=${type}></pocket-slots-item-ui>`
    }

    return html`${pocketSlots.map(_item => getPocketSlot(_item))}`
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
