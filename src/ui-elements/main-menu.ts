import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  MainButtonRenderInfo,
} from '@/types/main-types'
import { Languages } from '@/types/enums'

import { Game, MineDarkness } from '@/classes/mine-darkness'
import { GameState } from '@/classes/game-state'

interface MenuButtonRenderInfo extends MainButtonRenderInfo {
  isSpecial: boolean
}

const buttons: Array<MainButtonType> = [
  {
    type: 'gameStart', hidden: false,
    names: ['menuGameStart', 'menuGameContinue']
  },
  { type: 'rules', hidden: false, names: ['menuRules'] },
  { type: 'maps', hidden: false, names: ['menuselectedMap'] },
  { type: 'turnSound', hidden: false, names: ['menuTurnSoundOff', 'menuTurnSoundOn'] },
  { type: 'lang', hidden: false, names: ['menuToEng', 'menuToRu'] },
]

let changeStateCallback = (eventData: CustomEventInit) => {}

@customElement('main-menu')
export class MainMenu extends LitElement {

  private gameLink: MineDarkness | null = Game()

  @state()
  private _renderButtons: Array<MenuButtonRenderInfo> = []

  connectedCallback() {
    super.connectedCallback()
    changeStateCallback =
      GameState.SubscribeAndUpdateStateChanges(this.onChangeGameState, this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    GameState.OffStateChangesSubscribe(changeStateCallback)
  }

  onChangeGameState(eventData: unknown) {
    const state = (eventData as CustomEventInit).detail
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
          newButton.name = state.isSound ? button.names[1] : button.names[0]
          break
        case 'lang':
          newButton.name = state.lang == Languages.ru ? button.names[0] : button.names[1]
          break
        default:
          newButton.name = button.names[0]
          break
      }

      if (!this.gameLink) return
      newButton.name = this.gameLink.loc(newButton.name)

      renderButtons.push(newButton)
    })

    this._renderButtons = renderButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()

    if (!this.gameLink) return

    switch (type) {
      case 'gameStart':
        this.gameLink.state.isGame = true
        this.gameLink.SetNewStateValues(this.gameLink.state)
        break
      case 'lang':
        this.gameLink.state.lang = this.gameLink.state.lang == Languages.ru ? Languages.eng : Languages.ru
        this.gameLink.SetNewStateValues(this.gameLink.state)
        break
      case 'rules':
        this.gameLink.state.isRules = true
        this.gameLink.SetNewStateValues(this.gameLink.state)
        break
      case 'maps':
        this.gameLink.state.isMaps = true
        this.gameLink.SetNewStateValues(this.gameLink.state)
        break
      case 'turnSound':
        this.gameLink.state.isSound = !this.gameLink.state.isSound
        this.gameLink.SetNewStateValues(this.gameLink.state)
        break
    }
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
        ${this._renderButtons.map(el => renderOrderButton(el))}
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
