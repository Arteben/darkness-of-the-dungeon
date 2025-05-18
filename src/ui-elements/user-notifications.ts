import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { GameStateElement } from '@/classes/gamestate-element'

@customElement('user-notifications')
export class UserNotifications extends GameStateElement {

  render() {
    return html`
      <div></div>`
  }

  static styles = css`
  `
}
