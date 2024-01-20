import '@/ui/main-menu'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
// import * as types from '@/types/main'

@customElement('app-element')
export class AppElement extends LitElement {

  render() {
    return html`
      <game-engine></game-engine>
      <game-menu></game-menu>
      <mobile-controls></mobile-controls>
      <main-menu></main-menu>
    `
  }

  static styles = css`
  :host {
    height: 600px;

    width: 100%;
    background-color: black;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
  }
`
}
