
import { GameStateElement } from '@/classes/gamestate-element'

import { css, html, unsafeCSS } from 'lit'
import { customElement, property, queryAsync } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { GamePages } from '@/types/enums'

import '@/ui-elements/main-menu'
import '@/ui-elements/head-menu'
import '@/ui-elements/maps-menu'

// assets
import topPng from '@/styles/images/top.png'
import collonsPng from '@/styles/images/collons.png'
import bottomPng from '@/styles/images/botton.png'
import stripPng from '@/styles/images/stripLogoElement.png'
import leftColumnPng from '@/styles/images/leftcol.png'
import rightColumnPng from '@/styles/images/rightcol.png'
// import textMapRaw from '@assets/maps/map3.txt?url'
// import tilesRaw from '@assets/castle-tiles.png'
// import tipIcons from '@assets/tip-icons.png'
//

@customElement('game-app')
export class GameApp extends GameStateElement {

  @queryAsync('canvas')
  phaserCanvas!: Promise<HTMLCanvasElement | null>

  @queryAsync('div')
  canvasParent!: Promise<HTMLElement | null>

  render() {
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

    switch (this._state.page) {
      case GamePages.mainMenu:
        mainMenu = html`<main-menu></main-menu>`
        headMenu = html``
        logoElements = html `<div class="mainMenulogoElement stripMainMenuElement"></div>
                              <div class="mainMenulogoElement logoMainMenuElement" ></div>`
        topElementsClasses += 'topElementForMainMenu'
        mainElementsClasses += 'mainElementsForMainMenu'
        bottomImageForMainMenu = html`<div class="bottomElements"></div>`
        leftColumnElement = rightColumnElement = html``
        break
      case GamePages.game:
        convasDisplay = { 'display': 'block' }
        break
      case GamePages.maps:
        mapsMenu = html`<maps-menu></maps-menu>`
        break
    }

    return html`
        <div class="${topElementsClasses}">
          ${logoElements}
          ${headMenu}
        </div>
        <div class="${mainElementsClasses}">
          ${leftColumnElement}
          ${mainMenu}
          ${mapsMenu}
          ${rightColumnElement}
          <canvas style=${styleMap(convasDisplay)}></canvas>
        </div>
        ${bottomImageForMainMenu}
        <mobile-controls></mobile-controls>
    `
  }

  static styles = css`  
  :host {
    background: #131a23;
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
    height: 70px;
  }
  
  .topElementForMainMenu {
    display: block;
    height: 220px;
    background-image: linear-gradient(to bottom, #000000, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0));    
  }

  .mainMenulogoElement {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }

  .logoMainMenuElement {
    background-image: url(${unsafeCSS(topPng)});
    background-position: center;
    background-repeat: no-repeat;
  }

  .stripMainMenuElement {
    background-image: url(${unsafeCSS(stripPng)});
    height: 121px;
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
    margin-top: 210px;
    background-image: url(${unsafeCSS(collonsPng)});
    background-position: center;
    background-repeat: repeat-y;
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
    background-color: darkslateblue;
  }
`
}

declare global {
  interface HTMLElementTagNameMap {
    'game-app': GameApp
  }
}
