import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import '@/ui-elements/font-icon'
import '@/ui-elements/label-checkbox'

import { GameStateElement } from '@/classes/gamestate-element'
import { commonVars } from '@/utils/common-css-vars'

import { EventBus } from '@/classes/event-bus'

import {
  GameStateSettings,
  UserModalAddOptionsEnum,
  BusEventsList,
} from '@/types/enums'
import {
  NullOrGameStateSettings,
  IUserModalAddOptions,
} from '@/types/main-types'

const userModalMaxWidth = '70%'

@customElement('user-dialog-modals')
export class UserDialogModals extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.userDialogModal
  ]

  _modalAddOptions?: IUserModalAddOptions[]

  onCheckbox(prop: UserModalAddOptionsEnum, value: boolean) {
    const options = this._modalAddOptions
    if (!options || options.length == 0) return
    options.forEach((option: IUserModalAddOptions) => {
      if (option.prop == prop) {
        option.value = value
      }
    })
  }

  onClickOk() {
    EventBus.Dispatch(
      BusEventsList[BusEventsList.userModalOk], {options: this._modalAddOptions})
  }

  render() {
    if (!this._game) return

    const userModal = this._state.userModal
    if (userModal == null) {
      this._modalAddOptions = undefined
      return
    }

    this._modalAddOptions = userModal.options

    const getOptionCheckbox = (checkbox: IUserModalAddOptions) => {
    return html`<label-checkbox
        ?hasChecked="${checkbox.value}"
        @checkbox="${(e: CustomEvent) => {this.onCheckbox(checkbox.prop, e.detail) }}"
        >${this.loc(UserModalAddOptionsEnum[checkbox.prop])}</label-checkbox>`
  }

    const imgElement = userModal.image
      ? html`<img class="imgClass" src="${userModal.image}"/>` : html``

    return html`
      <div class="wrap">
        ${imgElement}
        <div class="textClass">
          <span>${userModal.text}</span>
          ${userModal.options?.map(checkbox => {
            return getOptionCheckbox(checkbox)
          })}
          <menu-button @click="${this.onClickOk}">
            ${this.loc('buttonOk')}
          </menu-button>
          </div>
      </div>
    `
  }

  static styles = [
    commonVars,
    css`:host {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: absolute;
      max-width: ${unsafeCSS(userModalMaxWidth)};
      max-height: 80%;
      top: 10%;
    }

    @keyframes expandIn {
      from {
        max-width: 0%;
      }
      to {
        max-width: ${unsafeCSS(userModalMaxWidth)};
      }
    }
    
    .wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: black;
      outline: var(--main-border);
      outline-width: 5px;
      line-height: 30px;
      overflow: hidden;
      animation-name: expandIn;
      animation-duration: 0.3s;
    }

    .imgClass {
      height: 250px;
      object-fit: contain;
    }

    .textClass {
      display: flex;
      flex-direction: column;
      justify-content: start;
      align-items: center;
      font-family: var(--info-panels-font);
      background: var(--main-background-light);
      font-weight: bold;
      font-size: 17px;
      padding: 20px;
      padding-bottom: 0;
      overflow: auto;
      overflow-x: hidden;
    }`
  ]
}
