import '@/ui/main-menu'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { ChangeGameStateData } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { BusEventsList } from '@/types/enums'

@customElement('app-element')
export class AppElement extends LitElement {

  @state()
  private _isGameStarted: boolean = false

  connectedCallback() {
    super.connectedCallback()

    EventBus.On(BusEventsList.changeGameState, (eventData: unknown) => {
      const state = (eventData as ChangeGameStateData).detail
      this._isGameStarted = state.isGameStarted
    })
  }

  private isGameStartedText() {
    if (this._isGameStarted) {
      return html`game started!`
    } else {
      return html`game off`
    }
  }

  render() {
    return html`
      <!-- <canvas id="phaserCanvas"></canvas> -->
      <div id="phaserCanvas">${this.isGameStartedText()}</div>
      <game-menu></game-menu>
      <mobile-controls></mobile-controls>
      <main-menu></main-menu>
    `
  }

  static styles = css`
  :host {
    height: 600px;

    width: 100%;
    background-color: black;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }

  #phaserCanvas {
    display: block;
    width: 100%;
    height: 100%;
    background: lightslategray;
    color: white;
    font-size: 20px;
  }
`
}
