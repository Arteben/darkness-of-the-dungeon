import { LitElement, css, html, unsafeCSS } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

import warriorImg from '@assets/warrior-modal.png'
import '@/ui-elements/font-icon'

import { GameStateElement } from '@/classes/gamestate-element'

import { commonVars } from '@/utils/common-css-vars'

import {
  GameStateSettings,
} from '@/types/enums'
import {
  NullOrGameStateSettings,
} from '@/types/main-types'

@customElement('user-dialog-modals')
export class UserDialogModals extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.userDialogModal
  ]

  render() {
    if (!this._game) return

    return html`
      <div class="wrap">
        <img class="imgClass" src="${warriorImg}"/>
        <div class="textClass">
          <span>
            Приведённый выше пример показывает очень простое использование элемента <img>. Атрибут src обязателен и содержит путь к изображению, которое вы хотите встроить в документ. Атрибут alt содержит текстовое описание изображения, которое не обязательно, но невероятно полезно для доступности — программы чтения с экрана читают это описание своим пользователям, так они знают какое изображение показано, и так же оно отображается на странице, если изображение не может быть загружено по какой-либо причине.

          </span>
          <span>
            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike">
            <label for="vehicle1"> I have a bike</label><br></span>
            <menu-button>Ok!</menu-button>
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
      max-width: 70%;
      max-height: 90%;
      top: 30px;
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
    }

    /* @keyframes expandIn {
      from {
      }
      to {
      }
    } */`
  ]
}
