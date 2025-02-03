import { LitElement, css, html, unsafeCSS } from 'lit'
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
    font-family: Faberge;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #f7ffff;
    background-color: #304147;
    border: black solid 2px;
    border-radius: 2px;
  }

    button.mainMenu, button.mapsMenu {
      font-size: 15px;
      width: 160px;
      padding: 10px 20px;
    }

    button.mapsMenu {
      width: 250px;
      padding: 10px 10px;
      border-color: black;
    }

    button.mainMenu.light, button.mapsMenu.light {
      color: #ffffff;
      background-color: #6d2626;
    }

    button.headMenu {
      padding: 0px 15px;
      margin: 0px 50px;
      height: 50px;
    }

    button:hover, button:active {
      outline: #eeeded solid 1px;
    }

    /* maps menu light */
    button.mapsMenu.light {
      background-color: #202d1b;
    }
    button.mapsMenu.light:hover, button.mapsMenu.light:active {
      outline: none;
    }
  `
}
