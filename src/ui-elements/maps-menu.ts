import { GameStateElement } from '@/classes/gamestate-element'

import '@/ui-elements/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

import {
  MainButtonRenderInfo,
  IJsonMap,
} from '@/types/main-types'

import { GameState } from '@/classes/game-state'

import { default as JsonMapList } from '@/assets/maps/map-list.json'

interface IMapButton extends MainButtonRenderInfo {
  selected: boolean
}


@customElement('maps-menu')
export class MapsMenu extends GameStateElement {

  getMapListButtons(state: GameState) {
    const mapButtons: Array<IMapButton> = []
    const mapList: IJsonMap[] = JsonMapList

    mapList.forEach((mapButton) => {
      const newButton: IMapButton = { type: '', name: '', selected: false }

      newButton.name = mapButton.name
      newButton.type = mapButton.name

      newButton.selected = mapButton.name == this._state.selectedMap
      console.log('selected', newButton.selected, mapButton.name, this._state.selectedMap)

      mapButtons.push(newButton)
    })

    return mapButtons
  }

  private OnClickButton(type: string, e: Event) {
    e.stopPropagation()

    if(type !== this._state.selectedMap) {
      this._state.selectedMap = type
      this.dispatchState()
    }
  }

  render() {
    const renderOrderButton = (buttonData: IMapButton) => {
      return html`
        <menu-button
          @click="${(e: Event) => { this.OnClickButton(buttonData.type, e) }}"
          placeClass="mapsMenu" ?isSpecial="${buttonData.selected}">
        ${buttonData.name}
      </menu-button>
      `
    }

    return html`
        ${this.getMapListButtons(this._state).map(el => renderOrderButton(el))}
    `
  }

  static styles = css`
    :host {
      position: fixed;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
    }

    menu-button {
      width: 300px;
    }
  `
}
