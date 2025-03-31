import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

@customElement('pocket-slots-item-ui')
export class PocketSlotsUi extends LitElement {

  @property({ type: String })
  placeClass = ''

  @property({ type: Boolean })
  isSpecial = false

  render() {
    return html`POCKET SLOTS`
  }

  static styles = css`
    :host {
      background: gray
    }
  `
}
