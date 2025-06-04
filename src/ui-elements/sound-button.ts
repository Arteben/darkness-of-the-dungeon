import { GameStateElement } from '@/classes/gamestate-element'

import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit-html/directives/class-map.js'

import { GameStateSettings, BusEventsList } from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'

import { commonVars } from '@/utils/common-css-vars'
import '@/ui-elements/menu-button'
import '@/ui-elements/font-icon'

import { onSoundValues, offSoundValues } from '@/classes/sound-system'
import { EventBus } from '@/classes/event-bus'

@customElement('sound-button')
export class SoundButton extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.soundValues
  ]

  @property({ type: Boolean })
  isIcon = false

  @property({ type: String })
  placeClass = ''

  OnClickButtonWithState(e: Event) {
    let soundValues
    if (this._state.soundValues.sfx == 0) {
      soundValues = { ...onSoundValues }
    } else {
      soundValues = { ...offSoundValues }
    }

    EventBus.Dispatch(BusEventsList[BusEventsList.setSoundValues], soundValues)
  }

  renderWithGame() {
    const isSound = this._state.soundValues.sfx > 0
    const text = this.loc((isSound ? 'menuTurnSoundOff' : 'menuTurnSoundOn'))
    const iconType = isSound ? 'volume-off' : 'volume-up'
    const slotContent =
      this.isIcon ? html`<font-icon size="25" icon="${iconType}"></font-icon>` : text
    const iconClass = { 'iconWidth': this.isIcon }
  return html`
       <menu-button
          class="${classMap(iconClass)}"
          @click="${this.OnClickButtonWithState}"
          placeClass="${this.placeClass}"
        >
            ${slotContent}
        </menu-button>
    `
  }

  static styles = [
    commonVars,
    css`:host {
      display: block;
    }
    
    .iconWidth {
      width: 50px;
    }`
  ]
}
