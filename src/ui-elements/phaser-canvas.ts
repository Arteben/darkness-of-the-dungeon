import '@/ui-elements/main-menu'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { ChangeGameStateData } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { BusEventsList } from '@/types/enums'

@customElement('phaser-canvas')
export class PhaserCanvas extends LitElement {

  @state()
  private _isMenu: boolean = true

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
    this._isMenu = state.isMainMenu
  }

  render() {
    const isPause = this._isMenu ? 'there is the pause!' : 'game!'

    return html`
      <div>
        ${isPause}
        <canvas></canvas>
      </div>
    `
  }

  static styles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
    background: black;
    color: white;
    font-size: 20px;
  }
`
}
