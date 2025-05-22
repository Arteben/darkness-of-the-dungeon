import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit-html/directives/style-map.js'
import { classMap } from 'lit-html/directives/class-map.js'

import { commonVars } from '@/utils/common-css-vars'

@customElement('info-panel')
export class InfoPanel extends LitElement {
  @property({ type: String })
  customMaxWidth = ''

  @property({ type: Boolean })
  noBorders = false

  @property({ type: Boolean })
  smallMap = false

  render() {
    const wrapStyles = {
      width: this.customMaxWidth != '' ? this.customMaxWidth : '',
    }

    const wrapAddClasses = {
      wrapNoBorders: this.noBorders,
    }

    const isSmallClass = { isSmall: this.smallMap }

    return html`
      <div class="wrap ${classMap(wrapAddClasses)}" style="${styleMap(wrapStyles)}">
        <h2 class="${classMap(isSmallClass)}">
          <slot name="head"> </slot>
        </h2> 
        <div class="textDiv ${classMap(isSmallClass)}">
          <slot name="content"></slot>
        </div>
      </div>`
  }

  static styles = [
    commonVars,
    css`:host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      overflow: hidden;
    }

    .wrap {
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
      overflow: auto;
      overflow-x: hidden;
      font-weight: bold;
    }

    .wrapNoBorders {
      border: none;
    }
    
    h2 {
      margin: 20px 0 10px 0;
      border: #304147 solid 0;
      border-width: 0 0 1px 0;
      font-size: 25px;
    }

    h2.isSmall {
      margin: 5px 10px 5px 10px;
      border: none;
      font-size: 22px;
      align-self: start;
    }

    .textDiv {
      display: flex;
      align-self: start;
      font-size: 17px;
      margin: 0 15px 20px 15px;
    }

    div.isSmall {
      font-size: 19px;
      margin: 0 10px 10px 10px;
    }`
  ]
}
