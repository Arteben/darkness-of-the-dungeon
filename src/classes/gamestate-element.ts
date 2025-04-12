import { LitElement } from 'lit'

import {
  SelectedJsonMap,
  NullOrGameStateSettings,
} from '@/types/main-types'

import { GameState } from '@/classes/game-state'
import { EventBus } from '@/classes/event-bus'

import { getDungeonDarknessGame } from '@/classes/dungeon-darkness'

export class GameStateElement extends LitElement {

  private changeStateCallback = (eventData: CustomEventInit) => { }

  _state: GameState = new GameState()
  _game = getDungeonDarknessGame()
  _stateSettings: NullOrGameStateSettings = null

  connectedCallback() {
    super.connectedCallback()
    this.changeStateCallback = EventBus.subscribeAndUpdateStateChanges(this.onChangeGameState, this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    EventBus.offStateChangesSubscribe(this.changeStateCallback)
  }

  private onChangeGameState(eventData: CustomEventInit) {
    if (!this._game) { return }

    const stateUpdate = () => {
      // @ts-ignore
      this._state = this._game.state
      this.requestUpdate()
    }

    const data = eventData.detail

    if (!this._stateSettings || !data) {
      stateUpdate()
      return
    }

    if (this._stateSettings.includes(data.property)) {
      stateUpdate()
    }
  }

  loc(someString: string): string {
    if (!this._game) {
      console.error('the component dosent find object game!!!!!!')
      return ''
    }

    return this._game.loc(someString)
  }

  getSelectedMap(): SelectedJsonMap {
    if (this._game) {
      return this._game.getSelectedMap()
    }

    return null
  }
}
