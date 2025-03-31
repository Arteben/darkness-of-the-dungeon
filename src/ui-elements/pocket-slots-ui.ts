import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

import '@/ui-elements/pocket-slots-item-ui'

@customElement('pocket-slots-ui')
export class PocketSlotsUi extends GameStateElement {

  render() {
    if (!this._game) return

    const slots = new Array(this._game.maxSlots)
    const items = this._state.pocketItems
    items.forEach((item, idx) => {
      slots[idx] = item
    })

    console.log('slots for view', slots)

    return html`POCKET SLOTS`
  }

  static styles = css`
    :host {
      background: gray
    }
  `
}
