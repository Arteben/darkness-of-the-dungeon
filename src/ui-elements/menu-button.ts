import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit-html/directives/style-map.js'

import { commonVars } from '@/utils/common-css-vars'

@customElement('menu-button')
export class MainMenu extends LitElement {
  @property({ type: String })
  placeClass = ''

  @property({ type: Boolean })
  isSpecial = false

  @property({ type: String })
  customMagins = ''

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
    const buttonAddStyles = {
      margin: this.customMagins != '' ? this.customMagins : '',
    }

    return html`
      <button
        class=${this.classesRender()}
        style="${styleMap(buttonAddStyles)}"
      >
        <slot></slot>
      </button>
    `
  }

  static styles = [
    commonVars,
    css`:host {
      display: block;
    }

    button {
      font-family: var(--main-buttons-font);
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: var(--main-color-light);
      background-color: var(--main-buttons-background);
      border: black solid 2px;
      border-radius: 2px;
      margin: 10px 0px;
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
      background-color: #383e35;
    }
    button.mapsMenu.light:hover, button.mapsMenu.light:active {
      outline: none;
    }`
  ]
}
