import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('menu-button')
export class MainMenu extends LitElement {
  @property({type: String})
  title=''

  render() {
    return html`
    <input type="button" value="${this.title}" />
    `
  }

  static styles = css`
    :host {
      display: block;
      width: 150px;
      height: 30px;
      margin: 10px;
      border-radius: 10px;
    }

    input {
      width: 100%;
      height: 100%;
      text-align: center;
      background: #231a2c;
      color: wheat
    }
  `
}
