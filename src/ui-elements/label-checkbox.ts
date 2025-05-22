import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { commonVars } from '@/utils/common-css-vars'

@customElement('label-checkbox')
export class LabelCheckbox extends LitElement {
  @property({ type: Boolean })
  hasChecked = false

  render() {
    return html`
      <div class="root">
        <input
          id="inputCheckbox" type="checkbox" ?checked="${this.hasChecked}" @change="${this.onCheckbox}">
        <label class="label" for="inputCheckbox">
          <slot></slot>
        </label>
      </div>`
  }

  onCheckbox(e: Event) {
    e.stopPropagation()
    const options = {
      // @ts-ignore
      detail: e.target.checked,
      bubbles: false,
      composed: true
    }

    this.dispatchEvent(new CustomEvent('checkbox', options))
  }

  static styles = [
    commonVars,
    css`:host {
      display: block;
    }
    
    .label {
      cursor: pointer;
    }`
  ]
}
