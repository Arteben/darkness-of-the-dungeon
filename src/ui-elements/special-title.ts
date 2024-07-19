import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('special-title')
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
      <div class=${this.classesRender()}><slot></slot></div>
    `
  }

  static styles = css`
    :host {
      display: block;
      margin: 2px 0;
    }

    div {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 12px;
      max-width: 300px;
    }

    div.mainMenu {
      margin-left: 100px;
      margin-bottom: 20px;
      color:  #dddddd;;
      border: none;
    }
  `
}
