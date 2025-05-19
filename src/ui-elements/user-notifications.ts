import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import '@/ui-elements/font-icon'

import { GameStateElement } from '@/classes/gamestate-element'

import { commonVars } from '@/utils/common-css-vars'

import {
  GameStateSettings,
  UserNotificationTypes,
} from '@/types/enums'
import {
  NotificationNullData,
  NullOrGameStateSettings,
} from '@/types/main-types'

const elementWidth = 400
const startDivElementHeight = 30

@customElement('user-notifications')
export class UserNotifications extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.userNotification
  ]

  render() {
    if (!this._game) return

    const notification: NotificationNullData = this._state.userNotification
    if (notification == null) return

    const timeouts = this._game.notificationAnimTimeouts

    let startDiv = html``
    let mainTextDiv = html``

    const getIconDiv = (type: UserNotificationTypes = UserNotificationTypes.ok) => {
      let icon = 'ok'
      if (type != UserNotificationTypes.ok) {
        icon = 'cancel'
      }
      return html`<div class="usualNotificationElements iconForText">
        <font-icon size="15" icon="${icon}"></font-icon>
      </div>`
    }

    const mainTextDivClasses = { mainTextDiv: true, breakMainTextDiv: false }
    const breakDivIconClasses = { breakIconDiv: true, breakIconDivNone: true }

    if (notification.type == UserNotificationTypes.start) {
      startDiv = html`<div
        style="animation-duration: ${timeouts.start}s;"
        class="usualNotificationElements startDiv"
      >${notification.text}</div>`
    } else {
      const isBreak = notification.type == UserNotificationTypes.break
      mainTextDivClasses.breakMainTextDiv = isBreak
      breakDivIconClasses.breakIconDivNone = !isBreak

      mainTextDiv = html`
        <div
          class="${classMap(mainTextDivClasses)}"
          style="transition-duration=${timeouts.break}s"
          >
          ${getIconDiv(notification.type)}
          <div class="usualNotificationElements">${notification.text}</div>
        </div>
        <div class="${classMap(breakDivIconClasses)}">
          <font-icon size="20" icon="attention"></font-icon>
        </div>
      `
    }

    return html`
      ${startDiv}
      ${mainTextDiv}`
  }

  static styles = [
    commonVars,
    css`:host {
      display: flex;
      flex-direction: row;
      width: ${unsafeCSS(elementWidth)}px;
      background: var(--game-app-bg-color);
      font-size: 15px;
      font-family: var(--main-buttons-font);
      color: var(--main-color-light);
      outline: var(--main-border);
      outline-width: 5px;
      position: absolute;
      top: 120px;
      line-height: 24px;
      padding: 0 10px;
    }

    @keyframes expandIn {
      from {
        height: 0px;
      }
      to {
        height: ${unsafeCSS(startDivElementHeight)}px;
      }
    }

    .mainTextDiv {
      display: flex;
      align-items: center;
      transition: max-height;
      max-height: 100%;
    }

    .usualNotificationElements {
      display: flex;
      align-items: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    
    .iconForText {
      margin-right: 20px;
      padding-right: 10px;
      border: 0 solid var(--main-color-light);
      border-width: 0 1px 0 0;
    }
    
    .startDiv {
      display: block;
      height: ${unsafeCSS(startDivElementHeight)}px;
      animation-name: expandIn;
      animation-timing-function: ease-out;
    }

    .breakMainTextDiv {
      opacity: 0;
      max-height: 0%;
      animation-name: expandOutIn;
      animation-timing-function: linear;
    }
    
    .breakIconDiv {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    
    .breakIconDivNone {
      display: none;
    }`
  ]
}
