import {
  GamePages,
  Languages,
  UrlHashes as Hashes,
} from '@/types/enums'
import { IHashParams } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'

import { getDungeonDarknessGame } from '@/classes/dungeon-darkness'

interface someHashesForPages {
  page: GamePages
  hash: Hashes
}

export class GameHashes {

  _location: Location
  _corrsPageHashes: someHashesForPages[] = [
    { page: GamePages.game, hash: Hashes.game },
    { page: GamePages.maps, hash: Hashes.maps },
    { page: GamePages.rules, hash: Hashes.rules },
    { page: GamePages.settings, hash: Hashes.settings },
  ]

  // params
  _lang: Languages = Languages.eng
  _page: GamePages = GamePages.mainMenu
  //

  constructor() {
    this._location = window.location
    const hashParams = this.getHashParams()
    this._lang = hashParams.lang
    this._page = hashParams.page

    EventBus.subscribeAndUpdateStateChanges(this.onChangeGameState, this)

    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      this.onHashChange()
    })
  }

  getHashStr(type: Hashes) {
    return Hashes[type]
  }

  getHashParams() {
    const params: IHashParams = {
      lang: this._lang, page: this._page
    }

    const isPageForHash = (hash: Hashes) => {
      const regExpForPage = new RegExp('^#[a-z]+\/' + this.getHashStr(hash) + '$', 'i')
      return regExpForPage.test(this._location.hash)
    }
    params.page = GamePages.mainMenu
    const findedElement = this._corrsPageHashes.find(element => {
      return (isPageForHash(element.hash))
    })
    if (findedElement != undefined) {
      params.page = findedElement.page
    }

    const langRexp = new RegExp('^#[a-z]+')
    const langSearches = this._location.hash.match(langRexp)
    if (langSearches?.length) {
      const langSearch = langSearches[0].toLocaleLowerCase()
      if (('#' + this.getHashStr(Hashes.eng)) == langSearch) {
        params.lang = Languages.eng
      } else if (('#' + this.getHashStr(Hashes.ru)) == langSearch) {
        params.lang = Languages.ru
      }
    }

    return params
  }

  getLocalStateForStart(): IHashParams {
    let page = this._page
    if (page == GamePages.game) {
      page = GamePages.mainMenu
    }

    return {
      lang: this._lang,
      page: page
    }
  }

  onHashChange() {
    const game = getDungeonDarknessGame()
    if (!game)
      return

    const newParams = this.getHashParams()

    if (newParams.page != this._page) {
      this._page = newParams.page
      game.state.page = this._page
    }

    if (newParams.lang != this._lang) {
      this._lang = newParams.lang
      game.state.lang = this._lang
    }
  }

  onChangeGameState(eventData: CustomEventInit) {
    const game = getDungeonDarknessGame()
    if (!game)
      return

    let isChanged = false
    let isRaplaceChanged = false

    if (game.state.lang != this._lang) {
      isRaplaceChanged = true
      this._lang = game.state.lang
    }

    if (game.state.page != this._page) {
      isChanged = true
      this._page = game.state.page
    }

    if (!(isChanged || isRaplaceChanged)) {
      return
    }

    let newHash =
      '#' + (this._lang == Languages.eng ? this.getHashStr(Hashes.eng) : this.getHashStr(Hashes.ru))

    const findedElement = this._corrsPageHashes.find(element => {
      return element.page == this._page
    })
    if (findedElement != undefined) {
      newHash += '/' + this.getHashStr(findedElement.hash)
    }

    if (isChanged) {
      window.history.pushState({}, '', newHash)
    } else {
      window.history.replaceState(null, '', newHash)
    }
  }
}
