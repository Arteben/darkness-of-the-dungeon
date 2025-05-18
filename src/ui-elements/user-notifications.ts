import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { GameStateElement } from '@/classes/gamestate-element'

import { commonVars } from '@/utils/common-css-vars'

import { GameStateSettings } from '@/types/enums'
import {
  INotificationData,
  NullOrGameStateSettings,
} from '@/types/main-types'

@customElement('user-notifications')
export class UserNotifications extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.userNotification
  ]

  render() {
    if (!this._game) return

    const timeouts = this._game.notificationAnimTimeouts
    const notification: INotificationData = this._state.userNotification
    const maxWidth = 400

    return html`
      <div></div>`
  }

  static styles = [
    commonVars,
    css`:host {
      width: 300px;
      height: 70px;
      background: var(--game-app-bg-color);
      border: var(--main-border);
      border-width: 5px;
      position: absolute;
      top: 120px;
    }`
  ]
}
