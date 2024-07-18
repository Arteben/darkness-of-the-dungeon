import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('menu-button')
export class MainMenu extends LitElement {
  @property({ type: String })
  placeClass = ''

  @property({ type: Boolean })
  isSpecial = false

  private classesRender() {
    let classes = ''
    if (!this.placeClass) {
      classes = 'mainMenu'
    } else {
      classes += this.placeClass
    }

    if (this.isSpecial) {
      classes += ' light'
    }

    return classes
  }

  render() {
    return html`
      <button class=${this.classesRender()}><slot></slot></button>
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
      color: #ffd9a6;
      background-image: linear-gradient(166deg, black, gray);
      border: #000000 solid 2px;
      border-radius: 9px;
    }

    button.mainMenu, button.mapsMenu {
      font-size: 15px;
      width: 160px;
      padding: 10px 20px;
    }

    button.mainMenu.light, button.mapsMenu.light {
      color: #ffffff;
      background-image: linear-gradient(270deg, #410c0c, #6d2626);
    }

    button.headMenu {
      font-size: 10px;
      padding: 0px 5px;
      margin: 0px 50px;
      height: 50px;
    }

    button:hover, button:active {
      outline: #eeeded solid 1px;
    }
  `
}
