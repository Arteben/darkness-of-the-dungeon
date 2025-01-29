
import { GameStateElement } from '@/classes/gamestate-element'

import { css, html } from 'lit'
import { customElement, queryAsync } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'
import { GamePages } from '@/types/enums'

import '@/ui-elements/main-menu'
import '@/ui-elements/head-menu'
import '@/ui-elements/maps-menu'

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

    switch (this._state.page) {
      case GamePages.mainMenu:
        mainMenu = html`<main-menu></main-menu>`
        headMenu = html``
        break
      case GamePages.game:
        convasDisplay = { 'display': 'block' }
        break
      case GamePages.maps:
        mapsMenu = html`<maps-menu></maps-menu>`
        break
    }

    return html`
      <div>
        ${mainMenu}
        ${mapsMenu}
        <canvas style=${styleMap(convasDisplay)}></canvas>
        ${headMenu}
        <mobile-controls></mobile-controls>
      </div>
    `
  }

  static styles = css`
  :host {
    display: block;
  }

  :host, div {
    width: 100%;
    height: 100%;
  }

  div {
    display: flex;
    background-image: linear-gradient(0deg, black, #272727);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
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
