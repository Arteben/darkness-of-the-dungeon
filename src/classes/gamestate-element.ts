import { LitElement } from 'lit'

import { mineDarknessGame } from '@/classes/mine-darkness'

import { IStateParams } from '@/types/main-types'

export class GameStateElement extends LitElement {
  _game = mineDarknessGame
  _state: IStateParams = {} as IStateParams

  connectedCallback() {
    super.connectedCallback()
    if (this._game) {
      this._game.subscribeAndUpdateStateChanges(this.onChangeGameState, this)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (this._game)
      this._game.offStateChangesSubscribe(this.onChangeGameState)
  }

  private onChangeGameState(eventData: unknown) {
    if (!this._game) {
      console.error('the element dosent find object game!!!!!!')
      return
    }

    this._state = {
      page: this._game.state.page,
      isSound: this._game.state.isSound,
      lang: this._game.state.lang,
      isGameStarted: this._game.state.isGameStarted,
    }

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
