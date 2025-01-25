import { GamePages, Languages } from '@/types/enums'
import { IHashParams } from '@/types/main-types'
import { mineDarknessGame } from '@/classes/mine-darkness'

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
  page: GamePages = GamePages.mainMenu
  //

  constructor() {
    this.location = window.location
    const hashParams = this.getHashParams()
    this.lang = hashParams.lang
    this.page = hashParams.page

    if (mineDarknessGame)
      mineDarknessGame.subscribeAndUpdateStateChanges(this.onChangeGameState, this)

    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      this.onHashChange()
    })

  }

  private getHashParams() {
    const params: IHashParams = {
      lang: this.lang, page: this.page
    }
    const langRexp = new RegExp('^#[a-z]+')
    const rulesRexp = new RegExp('^#[a-z]+\/'+ this.hashes.rules + '$', 'i')
    const gameRexp = new RegExp('^#[a-z]+\/' + this.hashes.game + '$', 'i')
    const mapsRexp = new RegExp('^#[a-z]+\/' + this.hashes.maps + '$', 'i')

    if (rulesRexp.test(this.location.hash)) {
      params.page = GamePages.rules
    } else if (gameRexp.test(this.location.hash)) {
      params.page = GamePages.game
    } else if (mapsRexp.test(this.location.hash)) {
      params.page = GamePages.maps
    } else {
      params.page = GamePages.mainMenu
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
      lang: this.lang,
      page: this.page
    }
  }

  onHashChange() {
    const game = mineDarknessGame
    if (!game)
      return

    const newParams = this.getHashParams()

    if (newParams.page != this.page) {
      this.page = newParams.page
      game.state.page = this.page
    }

    if (newParams.lang != this.lang) {
      this.lang = newParams.lang
      game.state.lang = this.lang
    }
  }

  onChangeGameState(eventData: unknown) {
    const state = (eventData as CustomEventInit).detail
    let isChanged = false
    let isRaplaceChanged = false

    if (state.lang != this.lang) {
      isRaplaceChanged = true
      this.lang = state.lang
    }

    if (state.page != this.page) {
      isChanged = true
      this.page = state.page
    }

    if (!(isChanged || isRaplaceChanged)) {
      return
    }

    let newHash = '#' + (this.lang == Languages.eng ? this.hashes.eng : this.hashes.ru)

    switch (this.page) {
      case GamePages.rules:
        newHash += '/' + this.hashes.rules
        break
      case GamePages.game:
        newHash += '/' + this.hashes.game
        break
      case GamePages.maps:
        newHash += '/' + this.hashes.maps
        break
    }

    if (isChanged) {
      window.history.pushState({}, '', newHash)
    } else {
      window.history.replaceState(null, '', newHash)
    }
  }
}
