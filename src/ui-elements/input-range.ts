import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styleMap } from 'lit-html/directives/style-map.js'

import { commonVars } from '@/utils/common-css-vars'


@customElement('input-range')
export class InputRange extends LitElement {
  @property({ type: Object })
  rangeParams = {
    max: 10, min: 0, step: 1,
  }

  @property({ type: Number })
  labelWidth: number = 300

  @property({ type: Number })
  valueRange = 0

  onChangeRange(e: Event) {
    const newValue = (e.target as HTMLInputElement).value
    e.stopPropagation()
    const options = {
      detail: newValue,
      bubbles: false,
      composed: true
    }

    this.dispatchEvent(new CustomEvent('changeRange', options))
  }

  render() {
    const labelWidth = { width: this.labelWidth + 'px' }

    const rangeParams = {
      min: 0, max: 100, step: 10,
    }

    return html`
      <div class="rootElement">
        <label for="mynumber" style="${styleMap(labelWidth)}">
          <slot></slot>
        </label>
        <input
          type="range"
          .value="${String(this.valueRange)}"
          min="${rangeParams.min}"
          max="${rangeParams.max}"
          step="${rangeParams.step}"
          id="mynumber"
          @change="${this.onChangeRange}"
        ></input>
      </div>
    `
  }

  static styles = [
    commonVars,
    css`:host {
      display: block;
    }
    
    .rootElement {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: start;
      color: var(--main-color-light);
      font-family: var(--main-buttons-font);
    }
    
    label {
      margin-right: 10px;
    }`
  ]
}
