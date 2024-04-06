import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('menu-button')
export class MainMenu extends LitElement {
  @property({ type: String })
  title = ''

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
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 15px;
      color: #ffd9a6;
      width: 200px;
      border: unset;
      padding: 10px 20px;
      background-image: linear-gradient(166deg, black, gray);
      border: #000000 solid 2px;
      border-radius: 9px;
    }

    button:hover, button:active {
      outline: #eeeded solid 2px;
    }
  `
}
