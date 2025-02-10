import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import styles from '@fontello/css/fontello.css?inline'

@customElement('font-icon')
export class FontIcon extends LitElement {
  @property({ type: Text })
  icon = ''

  @property({ type: Number })
  size = 0

  private iconClass() {
    return `icon-${this.icon}`
  }

  private styleFontSize() {
    return this.size > 0 ? `${this.size}px` : 'inherit'
  }

  render() {
    return html`
      <i class="${this.iconClass()}" style="font-size: ${this.styleFontSize()};"></i>`
  }

  static styles = [
    unsafeCSS(styles),
    css``
  ]
}
