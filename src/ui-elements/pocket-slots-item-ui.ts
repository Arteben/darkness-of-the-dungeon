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
      backImg: true,
      dontDropped: this.isDontDropped,
      selectedBackImg: this.isSelected,
      maybeSelectedBackImg: this.type > -1,
    }

    const actionIconClass = {
      slotActionIcon: true,
      slotActionIconSelected: this.isSelected,
    }

    const actionIconTrashClass = {
      slotActionIcon: true,
      slotActionIconSelected: this.isSelected && !this.isDontDropped,
    }

    const getItemIcon = (_type: number) => {
      const row = 16
      const tileWidth = 32

      const rowSize = (_type % row) * tileWidth
      const colSize = Math.floor(_type / row) * tileWidth

      const imgStyle = { backgroundPosition: `-${rowSize}px -${colSize}px` }

      return html`<div class="itemDiv" style="${styleMap(imgStyle)}"></div>`
    }

    return html`
      <div
        @click="${(e: Event) => { this.onClickItem(e, 'clickSlotItem') }}"
        class="${classMap(backImgClasses)}"
      >
        ${this.type != -1 ? getItemIcon(this.type) : ''}
      </div>
      <div
        class="slotIcons"
      >
        <font-icon
          icon="question-circle-o"
          class="${classMap(actionIconClass)}"
          size="20"
          @click="${(e: Event) => { this.onClickItem(e, 'clickQuestionIcon') }}"
        ></font-icon>
        <font-icon
          icon="trash"
          class="${classMap(actionIconTrashClass)}"
          size="20"
          @click="${(e: Event) => { this.onClickItem(e, 'clickTrashIcon') }}"
        ></font-icon>
      </div>`
  }

  private onClickItem(e: Event, type: string) {
    e.stopPropagation()
    const options = {
      detail: null,
      bubbles: false,
      composed: true
    }

    this.dispatchEvent(new CustomEvent(type, options))
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding: 0 3px;
    }

    .backImg {
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

    .maybeSelectedBackImg {
      cursor: pointer;
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
      display: block;
      background-repeat: no-repeat;
      background-origin: border-box;
      background-image: url(${unsafeCSS(itemIcons)});
    }

    .slotIcons {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: start;
      height: 100%;
      margin: 0 15px 0 5px;
    }

    .slotIcons:last-child {
      margin: 0 5px;
    }

    .slotActionIcon {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .slotActionIconSelected {
      color: rgb(255 255 255);
      cursor: pointer;
    }
  `
}
