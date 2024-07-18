import { GameRootElement } from '@/classes/root-element-template'

import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  MainButtonRenderInfo,
} from '@/types/main-types'

import { GameState } from '@/classes/game-state'

const buttons: Array<MainButtonType> = [
  { type: 'mainMenu', names: ['hMenuToMain'] }
]

@customElement('head-menu')
export class MainMenu extends GameRootElement {

  getRenderButtons(state: GameState) {
    const renderButtons: Array<MainButtonRenderInfo> = []

    buttons.forEach((button) => {
      const newButton: MainButtonRenderInfo = { type: button.type, hidden: false, name: '' }

      newButton.name = this.loc(button.names[0])

      renderButtons.push(newButton)
    })

    return renderButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()
    const game = this._game

    if (!game)
      return

    switch (type) {
      case 'mainMenu':
        game.state.isMainMenu = true
        break
    }
    game.dispatchStateChanges()
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
        ${this.getRenderButtons(this._state).map(el => renderOrderButton(el))}
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
