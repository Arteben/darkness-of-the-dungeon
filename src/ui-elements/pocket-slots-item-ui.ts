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

  @property({ type: Boolean })
  isSelected = false

  @property({ type: Number })
  type = -1

  render() {
    const backImgClasses = {
      slotDiv: true,
      dontDropped: this.isDontDropped,
      selectedBackImg: this.isSelected,
    }

    const getItemIcon = (_type: number) => {
      const row = 16
      const tileWidth = 32

      const rowSize = (_type % row) * tileWidth
      const colSize = Math.floor(_type / row) * tileWidth

      const imgStyle = { backgroundPosition: `-${rowSize}px -${colSize}px` }

      return html`<div class="itemDiv" style="${styleMap(imgStyle)}"></div>`
    }

    const fontIcon = html`
      <font-icon
        icon="trash"
        class="trashIcon"
        size="20"
        @click="${(e: Event) => { this.onClickItemTrash(e) }}"
      ></font-icon>
    `

    return html`
    <div
      @click="${(e: Event) => { this.onClickBack(e) }}"
      class="${classMap(backImgClasses)}"
    >
      ${this.type != -1 ? getItemIcon(this.type) : ''}
      ${this.isSelected && !this.isDontDropped ? fontIcon : ''}
    </div>`
  }

  private onClickBack(e: Event) {
    e.stopPropagation()
    const options = {
      detail: null,
      bubbles: false,
      composed: true
    }

    this.dispatchEvent(new CustomEvent('clickSlotItem', options))
  }

  private onClickItemTrash(e: Event) {
    e.stopPropagation()
    const options = {
      detail: null,
      bubbles: false,
      composed: true
    }

    this.dispatchEvent(new CustomEvent('clickTrushItem', options))
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
      display: block;
      background-repeat: no-repeat;
      background-origin: border-box;
      background-image: url(${unsafeCSS(itemBackImg)});
      background-position: -16px -48px;
    }

    .dontDropped {
      background-position: -10px -190px;
    }

    .selectedBackImg {
      outline: 5px groove wheat;
    }

    .itemDiv {
      width: 32px;
      height: 32px;
      display: inline-block;
      position: relative;
      top: 9px;
      left: 8px;
      background-repeat: no-repeat;
      background-origin: border-box;
      background-image: url(${unsafeCSS(itemIcons)});
    }

    .trashIcon {
      display: flex;
      justify-content: center;
      color: rgb(255 255 255);
      background: rgb(33 26 26);
      border-radius: 40px;
      width: 25px;
      padding: 5px;
      position: relative;
      top: -10px;
      left: 30px;
      cursor: pointer;
    }
  `
}
