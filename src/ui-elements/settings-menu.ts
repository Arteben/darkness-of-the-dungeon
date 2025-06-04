import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'


@customElement('settings-menu')
export class SettingsMenu extends GameStateElement {

  render() {

    return html`
    <div>
      settings menu
    </div>
    `
  }

  static styles = css`
  :host {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    margin-top: 20px;
    width: 400px;
  }

  span.mapTitle {
    font-size: 18px;
  }
  `
}
