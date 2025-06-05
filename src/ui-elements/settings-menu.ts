import { GameStateElement } from '@/classes/gamestate-element'

import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { commonVars } from '@/utils/common-css-vars'

import {
  GameStateSettings,
  UserModalAddOptionsEnum as ModalOptions,
  TypesOfSoundLevels as STypes,
  BusEventsList,
} from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'

import '@/ui-elements/menu-button'
import '@/ui-elements/label-checkbox'
import '@/ui-elements/sound-button'
import '@/ui-elements/input-range'

@customElement('settings-menu')
export class SettingsMenu extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.isShowGameIntro,
    GameStateSettings.soundValues
  ]

  onCheckbox(flag: boolean) {
    this._state.isShowGameIntro = flag
  }

  onChangeRange(value: number, type: STypes) {
    const soundValues = { ...this._state.soundValues }
    // @ts-ignore
    soundValues[STypes[type]] = value / 100
    EventBus.Dispatch(BusEventsList[BusEventsList.setSoundValues], soundValues)
  }

  renderWithGame() {
    const isCheck = this._state.isShowGameIntro
    const soundValues = this._state.soundValues

    const getInputRange = (type: STypes, rawValue: number) => {
      const value = rawValue * 100

      return html`
        <input-range
        valueRange="${value}"
        @changeRange="${(e: CustomEvent) => { this.onChangeRange(e.detail, type) }}"
        class="elementMenu" labelWidth="150"
      >
        ${this.argsLoc('menuTypeSound' + STypes[type], [String(value)])}
      </input-range>`
    }

    return html`
    <div class="root">
      <label-checkbox
        class="elementMenu checkboxRule"
        ?hasChecked="${isCheck}"
        @checkbox="${(e: CustomEvent) => { this.onCheckbox(e.detail) }}"
        >${this.loc('menuSettingsShownOnStart')}</label-checkbox>
        ${getInputRange(STypes.sfx, soundValues.sfx)}
        ${getInputRange(STypes.music, soundValues.music)}
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
    }
    
    .checkboxRule {
      margin-bottom: 70px;
    }`
  ]
}
