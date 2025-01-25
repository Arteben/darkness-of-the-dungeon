import { LitElement } from 'lit'

import { GameState } from '@/classes/game-state'
import { EventBus } from '@/classes/event-bus'

import { getMineDarknessGame } from '@/classes/mine-darkness'

export class GameStateElement extends LitElement {

  private changeStateCallback = (eventData: CustomEventInit) => { }

  _state: GameState = new GameState()
  _game = getMineDarknessGame()

  connectedCallback() {
    super.connectedCallback()
    this.changeStateCallback = EventBus.subscribeAndUpdateStateChanges(this.onChangeGameState, this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    EventBus.offStateChangesSubscribe(this.changeStateCallback)
  }

  private onChangeGameState(eventData: unknown) {
    if (!this._game) {
      return
    }

    this._state = this._game.state
    this.requestUpdate()
  }

  loc(someString: string): string {
    if (!this._game) {
      console.error('the component dosent find object game!!!!!!')
      return ''
    }

    return this._game.loc(someString)
  }
}
