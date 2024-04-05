import '@/ui/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { Game } from '@/classes/mine-darkness'

const buttons: Array<Array<string>> = [
  ['New game start'],
  ['Rules'],
  ['Turn sound'],
  ['Change language'],
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
      case 'New game start':
        game.state.isGameStarted = !game.state.isGameStarted
        game.SetNewStateValues(game.state)
        break
    }
  }

  private renderOrderButton(buttonData: Array<string>) {
    return html`
    <menu-button
      @click="${(e: Event) => {
        this.OnClickButton(buttonData[0], e)
      }}"
      title="${buttonData[0]}"></menu-button>
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
