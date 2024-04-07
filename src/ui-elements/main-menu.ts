import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import { Game } from '@/classes/mine-darkness'
import { MainButtonType, ChangeGameStateData, MainButtonRenderInfo } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { BusEventsList, Languages } from '@/types/enums'

const buttons: Array<MainButtonType> = [
  {
    type: 'gameStart', hidden: false,
    names: ['gameStart', 'gameContinue'], icons: ['fa-play']
  },
  { type: 'rules', hidden: false, names: ['menuRules'] },
  { type: 'turnSound', hidden: false, names: ['turnSoundOff', 'turnSoundOn'] },
  { type: 'lang', hidden: false, names: ['menuToEng', 'menuToRu'] },
]

@customElement('main-menu')
export class MainMenu extends LitElement {

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
      renderButtons.push(newButton)
    })

    this._renderButtons = renderButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()

    const game = Game()
    if (!game) {
      return
    }

    switch (type) {
      case 'gameStart':
        game.state.isGameStarted = true
        game.state.isMainMenu = false
        game.SetNewStateValues(game.state)
        break
      case 'lang':
        game.state.lang = game.state.lang == Languages.ru ? Languages.eng : Languages.ru
        game.SetNewStateValues(game.state)
        break
      case 'rules':
        game.state.isRules = true
        game.SetNewStateValues(game.state)
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
