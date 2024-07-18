import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  MainButtonRenderInfo,
} from '@/types/main-types'
import { Languages } from '@/types/enums'
import { GameState } from '@/classes/game-state'

interface MenuButtonRenderInfo extends MainButtonRenderInfo {
  isSpecial: boolean
}

const buttons: Array<MainButtonType> = [
  {
    type: 'gameStart', names: ['menuGameStart', 'menuGameContinue']
  },
  { type: 'rules', names: ['menuRules'] },
  { type: 'maps', names: ['menuselectedMap'] },
  { type: 'turnSound', names: ['menuTurnSoundOff', 'menuTurnSoundOn'] },
  { type: 'lang', names: ['menuToEng', 'menuToRu'] },
]

@customElement('main-menu')
export class MainMenu extends GameStateElement {

  getRenderButtons(state: GameState) {
    const renderButtons: Array<MenuButtonRenderInfo> = []

    buttons.forEach((button) => {
      const newButton: MenuButtonRenderInfo = { type: button.type, hidden: false, name: '', isSpecial: false }

      switch (button.type) {
        case 'gameStart':
          if (state.isGameStarted) {
            newButton.name = button.names[1]
            newButton.isSpecial = true
          } else {
            newButton.name = button.names[0]
          }
          break
        case 'turnSound':
          newButton.name = state.isSound ? button.names[0] : button.names[1]
          break
        case 'lang':
          newButton.name = state.lang == Languages.ru ? button.names[0] : button.names[1]
          break
        default:
          newButton.name = button.names[0]
          break
      }

      newButton.name = this.loc(newButton.name)

      renderButtons.push(newButton)
    })

    return renderButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()
    const game = this._game

    if (!game) return

    const state = game.state

    switch (type) {
      case 'gameStart':
        state.isGame = true
        break
      case 'lang':
        state.lang = state.lang == Languages.ru ? Languages.eng : Languages.ru
        break
      case 'rules':
        state.isRules = true
        break
      case 'maps':
        state.isMaps = true
        break
      case 'turnSound':
        state.isSound = !state.isSound
        break
    }

    game.dispatchStateChanges()
  }

  render() {
    const renderOrderButton = (buttonData: MenuButtonRenderInfo) => {
      if (buttonData.hidden) {
        return html``
      }

      return html`
        <menu-button
          @click="${(e: Event) => {this.OnClickButton(buttonData.type, e)}}"
          ?isspecial="${buttonData.isSpecial}">
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
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }
  `
}
