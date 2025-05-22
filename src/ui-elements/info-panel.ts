import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { commonVars } from '@/utils/common-css-vars'

@customElement('info-panel')
export class InfoPanel extends LitElement {
  @property({ type: Number })
  customMaxWidth = 0

  @property({ type: Boolean })
  smallMap = false

  private isSmallClases() {
    return this.smallMap ? 'isSmall' : ''
  }

  render() {
    return html`
      <h2 class="${this.isSmallClases()}">
        <slot name="head"> </slot>
      </h2> 
      <div class="${this.isSmallClases()}">
        <slot name="content"></slot>
      </div>`
  }

  static styles = [
    commonVars,
    css`:host {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      background-image: var(--main-background-light);
      border: var(--main-border);
      border-width: 9px;
      border-radius: 3px;
      color: var(--main-color-dark);
      font-family: var(--info-panels-font);
      font-weight: bold;
      font-size: 25px;
      overflow: auto;
      overflow-x: hidden;
      max-width: 700px;
    }
    
    h2 {
      margin: 20px 0 10px 0;
      border: #304147 solid 0;
      border-width: 0 0 1px 0;
    }

    h2.isSmall {
      margin: 5px 10px 5px 10px;
      border: none;
      font-size: 25px;
      align-self: start;
    }

    div {
      display: flex;
      align-self: start;
      margin: 0 20px 30px 20px;
    }

    div.isSmall {
      font-size: 20px;
      margin: 0 10px 10px 10px;
    }`
  ]
}
