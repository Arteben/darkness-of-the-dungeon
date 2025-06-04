import { GameStateElement } from '@/classes/gamestate-element'

import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { commonVars } from '@/utils/common-css-vars'

import {
  GameStateSettings,
  UserModalAddOptionsEnum as ModalOptions,
} from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'

import '@/ui-elements/menu-button'
import '@/ui-elements/label-checkbox'
import '@/ui-elements/sound-button'

@customElement('settings-menu')
export class SettingsMenu extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.isShowGameIntro
  ]

  onCheckbox(flag: boolean) {
    this._state.isShowGameIntro = flag
  }

  renderWithGame() {
    const isCheck = this._state.isShowGameIntro

    return html`
    <div class="root">
      <label-checkbox
        class="elementMenu"
        ?hasChecked="${isCheck}"
        @checkbox="${(e: CustomEvent) => { this.onCheckbox(e.detail) }}"
        >${this.loc(ModalOptions[ModalOptions.shownOnStart])}</label-checkbox>
      <sound-button class="elementMenu" ?isIcon="${false}"></sound-button>
    </div>
    `
  }

  static styles = [
    commonVars,
    css`
    :host {
      display: flex;
      flex-direction: row;
      justify-content: center;
    }

    .root {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 100px;
      width: 400px;
      color: var(--main-color-light);
      font-family: var(--main-buttons-font);
    }
    
    .elementMenu {
      margin-bottom: 20px;
    }`
  ]
}
