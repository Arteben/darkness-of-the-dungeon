import { LitElement, css, html } from 'lit'
import { customElement, state, queryAsync } from 'lit/decorators.js'
import { styleMap } from 'lit/directives/style-map.js'

import '@/ui-elements/main-menu'
import '@/ui-elements/head-menu'

import { GameState } from '@/classes/game-state'

let changeStateCallback = (eventData: CustomEventInit) => {}

@customElement('game-app')
export class GameApp extends LitElement {

  @queryAsync('canvas')
  phaserCanvas!: Promise<HTMLCanvasElement | null>

  @queryAsync('div')
  canvasParent!: Promise<HTMLElement | null>

  @state()
  private _state: GameState = new GameState()

  connectedCallback() {
    super.connectedCallback()
    changeStateCallback =
      GameState.SubscribeAndUpdateStateChanges(this.onChangeGameState, this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    GameState.OffStateChangesSubscribe(changeStateCallback)
  }

  private onChangeGameState(eventData: unknown) {
    const state = (eventData as CustomEventInit).detail
    this._state = state
  }

  render() {
    const mainMenu = this._state.isMainMenu ? html`<main-menu></main-menu>` : ''
    const headMenu = !this._state.isMainMenu ? html`<head-menu></head-menu>` : ''
    const convasDisplay = { 'display': (this._state.isGame) ? 'block' : 'none' }

    return html`
      <div>
        ${mainMenu}
        ${headMenu}
        <mobile-controls></mobile-controls>
        <canvas style=${styleMap(convasDisplay)}></canvas>
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
