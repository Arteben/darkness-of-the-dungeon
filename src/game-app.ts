
import { GameStateElement } from '@/classes/gamestate-element'

import { css, html, unsafeCSS } from 'lit'
import { customElement, queryAsync } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'

import {
  BusEventsList,
  GamePages,
  GameStateSettings,
} from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'

import { commonVars } from '@/utils/common-css-vars'

import { EventBus } from '@/classes/event-bus'

import '@/ui-elements/main-menu'
import '@/ui-elements/head-menu'
import '@/ui-elements/maps-menu'
import '@/ui-elements/user-notifications'

// assets
import topPng from '@/styles/images/top.png'
import bottomPng from '@/styles/images/botton.png'
import stripPng from '@/styles/images/stripLogoElement.png'
import leftColumnPng from '@/styles/images/leftcol.png'
import rightColumnPng from '@/styles/images/rightcol.png'
//

@customElement('game-app')
export class GameApp extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.pages,
    GameStateSettings.userNotification,
  ]

  @queryAsync('canvas')
  phaserCanvas!: Promise<HTMLCanvasElement | null>

  @queryAsync('div.mainElements')
  canvasParent!: Promise<HTMLElement | null>

  onNotificationClick (e: Event) {
    e.stopPropagation()
    EventBus.Dispatch(BusEventsList[BusEventsList.notificationClick], null)
  }

  render() {
    if (!this._game) return

    let mainMenu = html``
    let headMenu = html`<head-menu></head-menu>`
    let convasDisplay = { 'display': 'none' }
    let mapsMenu = html``
    let logoElements = html``
    let topElementsClasses = 'topElements '
    let mainElementsClasses = 'mainElements '
    let bottomImageForMainMenu = html``
    let leftColumnElement = html`<img class="columnPagesElement" src="${leftColumnPng}"/>`
    let rightColumnElement = html`<img class="columnPagesElement" src="${rightColumnPng}"/>`
    let userNotificationElement = html``

    switch (this._state.page) {
      case GamePages.mainMenu:
        mainMenu = html`<main-menu></main-menu>`
        headMenu = html``
        logoElements = html`<div class="mainMenulogoElement stripMainMenuElement"></div>
                              <div class="mainMenulogoElement logoMainMenuElement" ></div>`
        topElementsClasses += 'topElementForMainMenu'
        mainElementsClasses += 'mainElementsForMainMenu'
        bottomImageForMainMenu = html`<div class="bottomElements"></div>`
        leftColumnElement = rightColumnElement = html``
        break
      case GamePages.game:
        convasDisplay = { 'display': 'block' }
        leftColumnElement = rightColumnElement = html``
        userNotificationElement =
          this._state.userNotification != null
            ? html`<user-notifications @click="${this.onNotificationClick}">
              </user-notifications>`
            : html``
        break
      case GamePages.maps:
        mapsMenu = html`<maps-menu></maps-menu>`
        break
    }

    return html`
        <div class="${topElementsClasses}">
          ${headMenu}
        </div>
        <div class="${mainElementsClasses}">
          ${logoElements}
          ${leftColumnElement}
          ${mainMenu}
          ${mapsMenu}
          ${rightColumnElement}
          <canvas style=${styleMap(convasDisplay)}></canvas>
        </div>
        ${bottomImageForMainMenu}
        <mobile-controls></mobile-controls>
        ${userNotificationElement}
    `
  }

  static styles = [
    commonVars,
    css`:host {
      background: var(--game-app-bg-color);
      width: 100%;
      min-height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: start;
    }
    
    .topElements {
      display: flex;
      width: 100%;
      position: fixed;
      top: 0;
      height: 90px;
    }
    
    .topElementForMainMenu {
      display: none;
    }
    
    .mainMenulogoElement {
      width: 100%;
    }
    
    .logoMainMenuElement {
      height: 220px;
      margin-top: -128px;
      background-image: url(${unsafeCSS(topPng)});
      background-position: center;
      background-repeat: no-repeat;
    }
    
    .stripMainMenuElement {
      height: 121px;
      background-image: url(${unsafeCSS(stripPng)});
      background-position: bottom;
      background-repeat: repeat-x;
    }
    
    .mainElements {
      width: 100%;
      display: flex;
      flex-direction: row;
      align-items: start;
      justify-content: center;
      flex-grow: 1;
      margin-top: 90px;
    }
    
    .mainElementsForMainMenu {
      flex-direction: column;
      margin-top: 0;
    }
    
    .bottomElements {
      display: block;
      width: 100%;
      height: 61px;
      background-image: url(${unsafeCSS(bottomPng)});
      background-position: bottom;
      background-repeat: no-repeat;
    }
    
    .columnPagesElement {
      align-self: flex-end;
    }
    
    canvas {
      width: 1200px;
      height: 900px;
      border: var(--main-border);
      border-width: 10px;
    }
    
    user-notifications {
      cursor: pointer;
    }`
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    'game-app': GameApp
  }
}
