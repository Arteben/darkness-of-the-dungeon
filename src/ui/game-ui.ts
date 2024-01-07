import '@/ui/main-menu'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as types from '@/types/main'

@customElement('game-ui')
export class GameUi extends LitElement {
  render() {
    return html`
      <div>
        <game-menu></game-menu>
        <mobile-controls></mobile-controls>
        <main-menu></main-menu>
      </div>
    `
  }

  static styles = css`
    :host {
      background-color: rgba(100, 0, 0, 0.5);
      display: flex;
      width: 100%;
      height: 100%;
      display: flex;
      position: fixed;
      flex-direction: column;
      justify-content: start;
      align-items: center;
    }
  `
}
