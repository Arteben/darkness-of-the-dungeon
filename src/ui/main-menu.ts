import '@/ui/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('main-menu')
export class MainMenu extends LitElement {
  render() {
    return html`
      <div>
        <menu-button title="one"></menu-button>
        <menu-button title="two"></menu-button>
        <menu-button title="third"></menu-button>
      </div>
    `
  }

  static styles = css`
    :host {
      position: relative;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: center;
      align-items: center;
      background: beige;
      width: 300px;
    }
  `
}
