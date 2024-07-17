import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  MainButtonRenderInfo,
} from '@/types/main-types'

import { Game } from '@/classes/mine-darkness'
import { GameState } from '@/classes/game-state'

const buttons: Array<MainButtonType> = [
  { type: 'mainMenu', hidden: false, names: ['hMenuToMain'] }
]

let changeStateCallback = (eventData: CustomEventInit) => {}

@customElement('head-menu')
export class MainMenu extends LitElement {
  @state()
  private _renderButtons: Array<MainButtonRenderInfo> = []

  @state()
  private _state: GameState = new GameState()

  connectedCallback() {
    super.connectedCallback()
    changeStateCallback = GameState.SubscribeAndUpdateStateChanges(this.onChangeGameState, this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    GameState.OffStateChangesSubscribe(changeStateCallback)
  }

  private onChangeGameState(eventData: unknown) {
    const renderButtons: Array<MainButtonRenderInfo> = []
    const game = Game()

    if (!game)
      return

    buttons.forEach((button) => {
      const newButton: MainButtonRenderInfo = { type: button.type, hidden: false, name: '' }

      newButton.name = game.loc(button.names[0])

      renderButtons.push(newButton)
    })

    this._renderButtons = renderButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()
    const game = Game()

    if (!game)
      return

    switch (type) {
      case 'mainMenu':
        game.state.isMainMenu = true
        game.dispatchStateChanges()
        break
    }
  }

  render() {
    const renderOrderButton = (buttonData: MainButtonRenderInfo) => {
      if (buttonData.hidden) {
        return html``
      }

      return html`
        <menu-button
          @click="${(e: Event) => {this.OnClickButton(buttonData.type, e)}}"
          placeClass="headMenu">
        ${buttonData.name}
      </menu-button>
      `
    }

    return html`
        ${this._renderButtons.map(el => renderOrderButton(el))}
    `
  }

  static styles = css`
    :host {
      position: fixed;
      top: 0px;
      display: flex;
      flex-flow: row;
      justify-content: start;
      align-items: center;
      height: 70px;
      width: 100%;
      background-image: linear-gradient(rgb(149 0 0 / 74%), rgb(151 0 0 / 41%));
    }
  `
}
