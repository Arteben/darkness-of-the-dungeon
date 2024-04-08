import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import '@/ui-elements/main-menu'
import '@/ui-elements/phaser-canvas'

import { ChangeGameStateData } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { BusEventsList } from '@/types/enums'
import { GameState } from '@/classes/game-state'

@customElement('mine-darkness-root')
export class AppElement extends LitElement {

  @state()
  private _state: GameState = new GameState()

  connectedCallback() {
    super.connectedCallback()
    this.onChangeGameState = this.onChangeGameState.bind(this)
    EventBus.OnChangeGameStateItselfThis(this.onChangeGameState)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    EventBus.off(BusEventsList[BusEventsList.changeGameState], this.onChangeGameState)
  }

  private onChangeGameState(eventData: unknown) {
    const state = (eventData as ChangeGameStateData).detail
    this._state = state
  }

  render() {
    const mainMenu = this._state.isMainMenu ? html`<main-menu></main-menu>` : ''
    const phaserConvas = this._state.isGame ? html`<phaser-canvas></phaser-canvas>` : ''

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
