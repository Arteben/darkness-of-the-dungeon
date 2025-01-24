import { LitElement } from 'lit'

import { GameState } from '@/classes/game-state'
import { getMineDarkness, MineDarkness } from '@/classes/mine-darkness'

export class GameStateElement extends LitElement {

  private changeStateCallback = (eventData: CustomEventInit) => {}

  _state: GameState = new GameState()
  _game: MineDarkness | null = getMineDarkness()

  connectedCallback() {
    super.connectedCallback()
    this.changeStateCallback =
      GameState.SubscribeAndUpdateStateChanges(this.onChangeGameState, this)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    GameState.OffStateChangesSubscribe(this.changeStateCallback)
  }

  private onChangeGameState(eventData: unknown) {
    const state = (eventData as CustomEventInit).detail
    if (this._state !== state)
      this._state = state

    this.requestUpdate()
  }

  loc(someString: string): string {
    if (!this._game) {
      console.error('the component dosent find object game!!!!!!')
      return ''
    }

    return this._game.loc(someString)
  }

  dispatchState() {
    if(this._game) {
      this._game.dispatchStateChanges()
    } else {
      console.error('the element dosent find object game, for dispatch gamaState!!!!!!')
    }
  }
}
