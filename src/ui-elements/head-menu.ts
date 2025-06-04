import { GameStateElement } from '@/classes/gamestate-element'

import headBackPng from '@/styles/images/stripHeadMenu.png'

import '@/ui-elements/info-panel'
import '@/ui-elements/font-icon'
import '@/ui-elements/pocket-slots-ui'
import '@/ui-elements/sound-button'

import '@/ui-elements/menu-button'
import { css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { GamePages, GameStateSettings } from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'

import { default as mapTranlates } from '@/translates/maps.json'

@customElement('head-menu')
export class MainMenu extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.selectedMap,
    GameStateSettings.pages,
    GameStateSettings.lang,
  ]

  renderWithGame() {
    const map = this.getSelectedMap()
    let mapName = ''
    if (map) {
      mapName = this.loc(map.name, mapTranlates)
    }

    const isGame = this._state.page == GamePages.game
    const pocketSlots = isGame ? html`<pocket-slots-ui></pocket-slots-ui>` : html``

    return html`
        <div class="backgroundColor"></div>
        <div class="headMenuDiveder">
          <menu-button
            @click="${(e: Event) => { this._state.page = GamePages.mainMenu }}"
            placeClass="headMenu">
            <font-icon icon="th-list"></font-icon>
            ${this.loc('hMenuToMain')}
          </menu-button>
          <sound-button
            placeClass="buttonIconHeadMenu" ?isIcon="${true}"></sound-button>
        </div>
        <div class="headMenuDiveder">
          <info-panel ?smallMap=${true}>
            <span slot="content">${mapName}</span>
          </info-panel>
        </div>
        <div class="headMenuDiveder">
          ${pocketSlots}
        </div>
      `
  }

  static styles = css`
    :host {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      width: 100%;
      background-color: #0d0f12;
    }

    div.backgroundColor {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 90px;
      background-image: url(${unsafeCSS(headBackPng)});
      background-position: center;
      background-repeat: repeat-x;
    }

    .headMenuDiveder {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      flex-grow: 1;
      flex-basis: 33%;
      z-index: 2;
    }
  `
}
