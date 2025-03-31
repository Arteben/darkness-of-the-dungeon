import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { styleMap } from 'lit/directives/style-map.js'

import '@/ui-elements/font-icon'
import '@/ui-elements/menu-button'

import itemBackImg from '@assets/Inventory.png'
import itemIcons from '@assets/items-Icons.png'

@customElement('pocket-slots-item-ui')
export class PocketSlotsUi extends LitElement {

  @property({ type: Boolean })
  isDontDropped = false

  @property({ type: Number })
  type = -1

  render() {
    const backImgClasses = { slotDiv: true, dontDropped: this.isDontDropped }

    const getItemIcon = (_type: number) => {
      if (_type == -1) return html``

      const row = 16
      const tileWidth = 32

      const rowSize = (_type % row) * tileWidth
      const colSize = Math.floor(_type / row) * tileWidth

      const imgStyle = { backgroundPosition: `-${rowSize}px -${colSize}px` }

      return html`<div class="itemDiv" style="${styleMap(imgStyle)}"></div>`
    }

    return html`<div
      class="${classMap(backImgClasses)}"
    >${getItemIcon(this.type)}</div>`
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .slotDiv {
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-repeat: no-repeat;
      background-origin: border-box;
      background-image: url(${unsafeCSS(itemBackImg)});
      background-position: -16px -48px;
    }

    .dontDropped {
      background-position: -10px -190px;
    }

    .itemDiv {
      width: 32px;
      height: 32px;
      display: inline-block;
      background-repeat: no-repeat;
      background-origin: border-box;
      background-image: url(${unsafeCSS(itemIcons)});
    }
  `
}
