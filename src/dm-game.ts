import '@/ui/game-ui'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import * as types from '@/types/main'

@customElement('dm-game')
export class DmGame extends LitElement {

  render() {
    return html`
      <div>
        <game-engine />
        <game-ui />
      </div>
    `
  }

  static styles = css`
  :host {
    width: 100%;
    height: 500px;
    background-color: black;
  }
`
}
