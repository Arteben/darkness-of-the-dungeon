import { GameStateElement } from '@/classes/gamestate-element'

import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit-html/directives/class-map.js'

import { GameStateSettings } from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'

import { commonVars } from '@/utils/common-css-vars'
import '@/ui-elements/menu-button'
import '@/ui-elements/font-icon'

@customElement('sound-button')
export class SoundButton extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.hasSoundOn
  ]

  @property({ type: Boolean })
  isIcon = false

  @property({ type: String })
  placeClass = ''

  isSound = () => {
    return this._state?.hasSoundOn
  }

  OnClickButtonWithState(e: Event) {
    this._state.hasSoundOn = !this.isSound()
  }

  renderWithGame() {
    const isSound = this.isSound()
    const text = this.loc((isSound ? 'menuTurnSoundOff' : 'menuTurnSoundOn'))
    const iconType = isSound ? 'volume-off-1' : 'volume-up'
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
