import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('menu-button')
export class MainMenu extends LitElement {
  @property({type: String})
  title=''

  render() {
    return html`
      <button>${this.title}</button>
    `
  }

  static styles = css`
    :host {
      display: block;
      margin: 10px 0px;
    }

    button {
      display: block;
      font-size: 15px;
      color: white;
      width: 150px;
      border: unset;
      background: #1a1a1a;
      padding: 10px 20px;
    }

    button:hover {
      outline: white solid 2px;
    }
  `
}
