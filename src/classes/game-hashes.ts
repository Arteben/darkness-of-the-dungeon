import { Languages } from '@/types/enums'
import { IHashParams } from '@/types/main-types'
import { GameState } from '@/classes/game-state'
import { Game } from '@/classes/mine-darkness'

export class GameHashes {

  location: Location
  hashes: { [index: string]: string } = {
    ru: 'ru',
    eng: 'en',
    rules: 'rules',
    game: 'game',
    maps: 'maps',
  }

  // params
  lang: Languages = Languages.eng
  isRules: boolean = false
  isGame: boolean = false
  isMaps: boolean = false
  //

  constructor() {
    this.location = window.location
    const hashParams = this.getHashParams()
    this.lang = hashParams.lang
    this.isRules = hashParams.isRules
    this.isGame = hashParams.isGame
    this.isMaps = hashParams.isMaps

    GameState.SubscribeAndUpdateStateChanges(this.onChangeGameState, this)

    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      this.onHashChange()
    })

  }

  private getHashParams() {
    const params: IHashParams = {
      lang: this.lang, isRules: this.isRules, isGame: this.isGame, isMaps: this.isMaps,
    }
    const langRexp = new RegExp('^#[a-z]+')
    const rulesRexp = new RegExp('^#[a-z]+\/'+ this.hashes.rules + '$', 'i')
    const gameRexp = new RegExp('^#[a-z]+\/' + this.hashes.game + '$', 'i')
    const mapsRexp = new RegExp('^#[a-z]+\/' + this.hashes.maps + '$', 'i')

    params.isRules = params.isGame = params.isMaps = false
    if (rulesRexp.test(this.location.hash)) {
      params.isRules = true
    } else if (gameRexp.test(this.location.hash)) {
      params.isGame = true
    } else if (mapsRexp.test(this.location.hash)) {
      params.isMaps = true
    }

    const langSearches = this.location.hash.match(langRexp)
    if (langSearches?.length) {
      const langSearch = langSearches[0].toLocaleLowerCase()
      if (('#' + this.hashes.eng) == langSearch) {
        params.lang = Languages.eng
      } else if (('#' + this.hashes.ru) == langSearch) {
        params.lang = Languages.ru
      }
    }

    return params
  }

  getLocalState(): IHashParams {
    return {
      isRules: this.isRules,
      lang: this.lang,
      isGame: this.isGame,
      isMaps: this.isMaps,
    }
  }

  onHashChange() {
    const game = Game()
    if (!game) return

    const newParams = this.getHashParams()
    let isChanged = false

    if (newParams.isRules != this.isRules) {
      isChanged = true
      this.isRules = newParams.isRules
    }

    if (newParams.isGame != this.isGame) {
      isChanged = true
      this.isGame = newParams.isGame
    }

    if (newParams.isMaps != this.isMaps) {
      isChanged = true
      this.isMaps = newParams.isMaps
    }

    if (newParams.lang != this.lang) {
      isChanged = true
      this.lang = newParams.lang
    }

    if (!isChanged) {
      return
    }

    game.state.isRules = this.isRules
    game.state.lang = this.lang
    game.state.isGame = this.isGame
    game.state.isMaps = this.isMaps

    game.dispatchStateChanges()
  }

  onChangeGameState(eventData: unknown) {
    const state = (eventData as CustomEventInit).detail
    let isChanged = false
    let isRaplaceChanged = false

    if (state.lang != this.lang) {
      isRaplaceChanged = true
      this.lang = state.lang
    }

    if (state.isRules != this.isRules) {
      isChanged = true
      this.isRules = state.isRules
    }

    if (state.isGame != this.isGame) {
      isChanged = true
      this.isGame = state.isGame
    }

    if (state.isMaps != this.isMaps) {
      isChanged = true
      this.isMaps = state.isMaps
    }

    if (!(isChanged || isRaplaceChanged)) {
      return
    }

    let newHash = '#' + (this.lang == Languages.eng ? this.hashes.eng : this.hashes.ru)

    if (this.isRules) {
      newHash += '/' + this.hashes.rules
    } else if (this.isGame) {
      newHash += '/' + this.hashes.game
    } else if (this.isMaps) {
      newHash += '/' + this.hashes.maps
    }

    if (isChanged) {
      window.history.pushState({}, '', newHash)
    } else {
      window.history.replaceState(null, '', newHash)
    }
  }
}
