import { LitElement } from 'lit'

import { GameState } from '@/classes/game-state'
import { Game, MineDarkness } from '@/classes/mine-darkness'

export class GameRootElement extends LitElement {

  private changeStateCallback = (eventData: CustomEventInit) => {}

  _state: GameState = new GameState()
  _game: MineDarkness | null = Game()

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
}
