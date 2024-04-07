import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonType,
  ChangeGameStateData,
  MainButtonRenderInfo,
} from '@/types/main-types'
import { BusEventsList, Languages } from '@/types/enums'

import { Game, MineDarkness } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'

const buttons: Array<MainButtonType> = [
  {
    type: 'gameStart', hidden: false,
    names: ['menuGameStart', 'menuGameContinue'], icons: ['fa-play']
  },
  { type: 'rules', hidden: false, names: ['menuRules'] },
  { type: 'turnSound', hidden: false, names: ['menuTurnSoundOff', 'menuTurnSoundOn'] },
  { type: 'lang', hidden: false, names: ['menuToEng', 'menuToRu'] },
]

@customElement('main-menu')
export class MainMenu extends LitElement {

  private gameLink: MineDarkness | null = Game()

  @state()
  private _renderButtons: Array<MainButtonRenderInfo> = []

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
    const renderButtons: Array<MainButtonRenderInfo> = []

    buttons.forEach((button) => {
      const newButton: MainButtonRenderInfo = { type: button.type, hidden: false, name: '' }

      switch (button.type) {
        case 'gameStart':
          newButton.name = state.isGameStarted ? button.names[1] : button.names[0]
          break
        case 'turnSound':
          newButton.name = state.isSound ? button.names[1] : button.names[0]
          break
        case 'lang':
          newButton.name = state.lang == Languages.ru ? button.names[0] : button.names[1]
          break
        case 'rules':
          newButton.name = button.names[0]
          newButton.hidden = state.isRules
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
        this.gameLink.state.isGameStarted = true
        this.gameLink.state.isMainMenu = false
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
    }
  }

  render() {
    const renderOrderButton = (buttonData: MainButtonRenderInfo) => {
      if (buttonData.hidden) {
        return html``
      }

      return html`
        <menu-button
          @click="${(e: Event) => {
          this.OnClickButton(buttonData.type, e)
        }}"
          title="${buttonData.name}"></menu-button>
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
