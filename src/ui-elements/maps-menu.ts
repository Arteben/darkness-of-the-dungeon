import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'


import { DifficultyLevels } from '@/types/enums'
import { MainButtonRenderInfo, IJsonMap } from '@/types/main-types'

import { default as JsonMapList } from '@/assets/maps/map-list.json'
import { default as mapTranlates } from '@/translates/maps.json'

interface IMapButton extends MainButtonRenderInfo {
  selected: boolean
  difficult: DifficultyLevels
}

@customElement('maps-menu')
export class MapsMenu extends GameStateElement {

  getMapListButtons() {
    const mapButtons: Array<IMapButton> = []
    const mapList = JsonMapList as IJsonMap[]

    mapList.forEach((mapButton) => {
      const newButton: IMapButton =
      { type: '', name: '', selected: false, difficult: DifficultyLevels.easy, hidden: false }

      newButton.name = this.loc(mapButton.name, mapTranlates)
      newButton.type = mapButton.name
      newButton.difficult = mapButton.level

      newButton.selected = mapButton.name == this._state.selectedMap?.type

      mapButtons.push(newButton)
    })

    return mapButtons
  }

  private OnClickButton(data: IMapButton, e: Event) {
    e.stopPropagation()
      this._state.selectedMap = {
        type: data.type,
        difficult: data.difficult,
      }
  }

  render() {
    const renderOrderButton = (buttonData: IMapButton) => {
      return html`
          <menu-button
            @click="${(e: Event) => { this.OnClickButton(buttonData, e) }}"
            placeClass="mapsMenu" ?isSpecial="${buttonData.selected}">
              <span class="mapTitle">${buttonData.name}</span>
              <br/> <hr> 
              <span>${this.loc(DifficultyLevels[buttonData.difficult])}</span>
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
