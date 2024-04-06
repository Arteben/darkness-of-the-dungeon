import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import '@/ui-elements/main-menu'
import '@/ui-elements/phaser-canvas'

import { ChangeGameStateData } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { BusEventsList } from '@/types/enums'

@customElement('mine-darkness-root')
export class AppElement extends LitElement {

  @state()
  private _isMainMenu: boolean = true

  @state()
  private _isGameStarted: boolean = false

  connectedCallback() {
    super.connectedCallback()
    this.onChangeGameState = this.onChangeGameState.bind(this)
    EventBus.OnChangeGameStateItselfThis(this.onChangeGameState)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    EventBus.off(BusEventsList.changeGameState, this.onChangeGameState)
  }

  private onChangeGameState(eventData: unknown) {
    const state = (eventData as ChangeGameStateData).detail
    this._isGameStarted = state.isGameStarted
    this._isMainMenu = state.isMainMenu
  }

  render() {
    const mainMenu = this._isMainMenu ? html`<main-menu></main-menu>` : ''
    const phaserConvas = this._isGameStarted ? html`<phaser-canvas></phaser-canvas>` : ''

    return html`
      ${mainMenu}
      <game-menu></game-menu>
      <mobile-controls></mobile-controls>
      ${phaserConvas}
    `
  }

  static styles = css`
  :host {
    width: 100%;
    height: 100%;
    background: gray;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`
}
