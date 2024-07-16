import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  MainButtonRenderInfo,
} from '@/types/main-types'

import { Game, MineDarkness } from '@/classes/mine-darkness'
import { GameState } from '@/classes/game-state'

const buttons: Array<MainButtonType> = [
  { type: 'mainMenu', hidden: false, names: ['hMenuToMain'] }
]

let changeStateCallback = (eventData: CustomEventInit) => {}

@customElement('head-menu')
export class MainMenu extends LitElement {

  private gameLink: MineDarkness | null = Game()

  @state()
  private _renderButtons: Array<MainButtonRenderInfo> = []

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

    buttons.forEach((button) => {
      const newButton: MainButtonRenderInfo = { type: button.type, hidden: false, name: '' }

      if (!this.gameLink) return
      newButton.name = this.gameLink.loc(button.names[0])

      renderButtons.push(newButton)
    })

    this._renderButtons = renderButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()

    if (!this.gameLink) return

    switch (type) {
      case 'mainMenu':
        this.gameLink.state.isMainMenu = true
        this.gameLink.SetNewStateValues(this.gameLink.state)
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
