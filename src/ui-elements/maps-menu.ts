import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import { css, html, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'

import { GamePages } from '@/types/enums'
import { MainButtonRenderInfo, IJsonMap } from '@/types/main-types'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

interface IMapButton extends MainButtonRenderInfo {
  selected: boolean
  difficult: string
}

const topIndent = 70

@customElement('maps-menu')
export class MapsMenu extends GameStateElement {

  getMapListButtons() {
    const mapButtons: Array<IMapButton> = []
    const mapList: IJsonMap[] = JsonMapList

    mapList.forEach((mapButton) => {
      const newButton: IMapButton = { type: '', name: '', selected: false, difficult: 'easy', hidden: false }

      newButton.name = this.loc(mapButton.name)
      newButton.type = mapButton.name
      newButton.difficult = this.loc(mapButton.level)

      newButton.selected = mapButton.name == this._state.selectedMap

      mapButtons.push(newButton)
    })

    return mapButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()

    if (type !== this._state.selectedMap) {
      this._state.selectedMap = type
      if (this._game) {
        this._game.state.page = GamePages.mainMenu
      }
    }
  }

  render() {
    const renderOrderButton = (buttonData: IMapButton) => {
      return html`
          <menu-button
            @click="${(e: Event) => { this.OnClickButton(buttonData.type, e) }}"
            placeClass="mapsMenu" ?isSpecial="${buttonData.selected}">
          ${buttonData.name} <br> <hr> ${buttonData.difficult}
        </menu-button>
      `
    }

    return html`
    <div>
      ${this.getMapListButtons().map(el => renderOrderButton(el))}
    </div>
    `
  }

  static styles = css`
  :host {
    position: fixed;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin-top: ${unsafeCSS(topIndent)}px;
    height: calc(100% - ${unsafeCSS(topIndent)}px);
    width: 100%;
  }

  div {
    display: flex;
    width: 100%;
    max-height: 100%;
    flex-flow: column;
    justify-content: start;
    align-items: center;
    overflow-y: auto;
  }
  `
}
