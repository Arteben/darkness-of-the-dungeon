import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import '@/ui-elements/special-title'
import '@/ui-elements/info-panel'

import { css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  MainButtonRenderInfo,
} from '@/types/main-types'
import { Languages, GamePages } from '@/types/enums'
import { GameState } from '@/classes/game-state'


interface MenuButtonRenderInfo extends MainButtonRenderInfo {
  isSpecial: boolean
  hidden: boolean
}

const buttons: Array<MainButtonType> = [
  { type: 'gameStart', names: ['menuGameStart', 'menuGameContinue'] },
  { type: 'rules', names: ['menuRules'] },
  { type: 'maps', names: ['menuChangeMap'] },
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
        case 'maps':
          newButton.name = button.names[0]
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

    if (!this._game) {
      return
    }

    const state = this._game.state

    switch (type) {
      case 'gameStart':
        state.page = GamePages.game
        break
      case 'lang':
        state.lang = state.lang == Languages.ru ? Languages.eng : Languages.ru
        break
      case 'rules':
        state.page = GamePages.rules
        break
      case 'maps':
        state.page = GamePages.maps
        break
      case 'turnSound':
        state.isSound = !state.isSound
        break
    }
  }

  render() {

    if (!this._game) {
      return
    }

    const renderOrderButton = (buttonData: MenuButtonRenderInfo) => {
      if (buttonData.hidden) {
        return html``
      }

      let mapInfo = html``
      const map = this.getSelectedMap()
      if (buttonData.type == 'gameStart' && map) {
        mapInfo = html`
          <info-panel ?smallmap=${true} style="max-width:150px;">
            <span slot="head">${this.loc('menuSelectedMap')}</span>
            <span slot="content"> ${this.loc(map.name)} (${this.loc(map.level)})</span>
          </info-panel>
        `
      }

      return html`
        ${mapInfo}
        <menu-button
          @click="${(e: Event) => { this.OnClickButton(buttonData.type, e) }}"
          ?isspecial="${buttonData.isSpecial}">
            ${buttonData.name}
        </menu-button>
      `
    }

    return html`
        ${this.getRenderButtons(this._game.state).map(el => renderOrderButton(el))}
    `
  }

  static styles = css`
    :host {
      display: flex;
      flex-flow: column;
      justify-content: space-around;
      align-self: stretch;
      align-items: center;
      margin-top: 10px;
      max-height: 650px;
    }
  `
}
