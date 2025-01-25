import { LitElement } from 'lit'
import { property } from 'lit/decorators.js'

import { mineDarknessGame } from '@/classes/mine-darkness'

import { GamePages, Languages } from '@/types/enums'

export class GameStateElement extends LitElement {
  _game = mineDarknessGame

  @property()
  _pages = GamePages.mainMenu

  @property({attribute: false})
  _isGameStarted = false

  @property({attribute: false})
  _isSound = true

  @property({attribute: false})
  _selectedMap: string | undefined  = ''

  @property({attribute: false})
  _lang: Languages = Languages.eng

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

    console.log('new page', this._pages, this._game.state.page)
    this._pages = this._game.state.page
    this._isGameStarted = this._game.state.isGameStarted
    this._isSound = this._game.state.isSound
    this._selectedMap = this._game.state.selectedMap
    this._lang = this._game.state.lang

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
