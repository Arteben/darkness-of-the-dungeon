import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { Game } from '@/classes/mine-darkness'
import { MainButtonType } from '@/types/main-types'

const buttons: Array<MainButtonType> = [
  { type: 'gameStart', hidden: false, names: ['gameStart', 'gamePause'] },
  { type: 'rules', hidden: false, names: ['rules'] },
  { type: 'turnSound', hidden: false, names: ['turnSoundOff', 'turnSoundOn'] },
  { type: 'lang', hidden: false, names: ['someLang'] },
]

@customElement('main-menu')
export class MainMenu extends LitElement {

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()

    const game = Game()
    if (!game) {
      return
    }

    switch (type) {
      case 'gameStart':
        game.state.isGameStarted = true
        game.state.isMainMenu = !game.state.isMainMenu
        game.SetNewStateValues(game.state)
        break
    }
  }

  static GetButtonNameFromInfo(info: MainButtonType): string {
    let name = ''
    const game = Game()
    if (!game) {
      return name
    }

    switch (info.type) {
      case 'gameStart':
        name = game.state.isGameStarted ? info.names[1] : info.names[0]
        break
      case 'turnSound':
        name = game.state.isSound ? info.names[1] : info.names[0]
      default:
        name = info.names[0]
        break
    }

    return name
  }

  private renderOrderButton(buttonData: MainButtonType) {

    if (buttonData.hidden) {
      return html``
    }

    return html`
      <menu-button
        @click="${(e: Event) => {
          this.OnClickButton(buttonData.type, e)
        }}"
        title="${MainMenu.GetButtonNameFromInfo(buttonData)}"></menu-button>
    `
  }

  render() {
    return html`
        ${buttons.map(el => this.renderOrderButton(el))}
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
    }
  `
}
