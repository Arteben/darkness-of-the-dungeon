import { LitElement } from 'lit'

import {
  SelectedJsonMap,
  NullOrGameStateSettings,
  IJsonTranslatesType,
} from '@/types/main-types'

import { DungeonDarkness } from '@/classes/dungeon-darkness'
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

  render() {
    if (!this._game) { return }
    return this.renderWithGame(this._game)
  }

  // added functions here
  // it runs with GAME OBJECT!
  renderWithGame(game: DungeonDarkness) { }

  loc(someString: string, pageTranslates?: IJsonTranslatesType): string {
    if (!this._game) return ''
    return this._game.locals.loc(someString, pageTranslates)
  }

  argsLoc(someString: string, args: string[], pageTranslates?: IJsonTranslatesType): string {
    if (!this._game) return ''
    return this._game.locals.locWithArgs(someString, args, pageTranslates)
  }

  getSelectedMap(): SelectedJsonMap {
    if (this._game) {
      return this._game.getSelectedMap()
    }

    return null
  }
}
