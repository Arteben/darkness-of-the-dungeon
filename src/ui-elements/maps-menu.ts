import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { MainButtonRenderInfo, IJsonMap } from '@/types/main-types'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

interface IMapButton extends MainButtonRenderInfo {
  selected: boolean
  difficult: string
}

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
    }
  }

  render() {
    const renderOrderButton = (buttonData: IMapButton) => {
      return html`
          <menu-button
            @click="${(e: Event) => { this.OnClickButton(buttonData.type, e) }}"
            placeClass="mapsMenu" ?isSpecial="${buttonData.selected}">
              <span class="mapTitle">${buttonData.name}</span>
              <br/> <hr> 
              <span>${buttonData.difficult}</span>
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    margin-top: 20px;
    width: 400px;
  }

  span.mapTitle {
    font-size: 18px;
  }
  `
}
