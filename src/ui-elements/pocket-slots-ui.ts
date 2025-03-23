import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { GamePages } from '@/types/enums'

import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

@customElement('pocket-slots-ui')
export class PocketSlotsUi extends GameStateElement {

  connectedCallback() {
    super.connectedCallback()
  }


  render() {
    // if (!this._game || !this._slots.length) { return }

    return html`POCKET SLOTS`
  }

  static styles = css`
    :host {
      background: gray
    }
  `
}
