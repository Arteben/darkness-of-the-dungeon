import { Languages } from '@/types/enums'
import { ILocalGameState, IHashParams, ChangeGameStateData } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { Game } from '@/classes/mine-darkness'

export class GameHashes {

  location: Location

  // params
  lang: Languages = Languages.eng
  isRules: boolean = false
  //

  constructor() {
    this.location = window.location
    const hashParams = this.getHashParams()
    this.lang = hashParams.lang
    this.isRules = hashParams.isRules

    this.onChangeGameState = this.onChangeGameState.bind(this)
    EventBus.OnChangeGameStateItselfThis(this.onChangeGameState)

    window.addEventListener('hashchange', (e: HashChangeEvent) => {
      this.onHashChange(e)
    })

  }

  private getHashParams() {
    const params: IHashParams = { lang: this.lang, isRules: this.isRules }
    const langRexp = new RegExp('^#[a-z]+')
    const rulesRexp = new RegExp('^#[a-z]+\/rules$', 'i')

    params.isRules = rulesRexp.test(this.location.hash)

    const langSearches = this.location.hash.match(langRexp)
    if (langSearches?.length) {
      const langSearch = langSearches[0].toLocaleLowerCase()
      if ('#en' == langSearch) {
        params.lang = Languages.eng
      } else if ('#ru' == langSearch) {
        params.lang = Languages.ru
      }
    }

    return params
  }

  getLocalState(): ILocalGameState {
    return {
      isRules: this.isRules,
      lang: this.lang,
    }
  }

  onHashChange(event: HashChangeEvent) {
    const game = Game()
    if (!game) {
      return
    }

    const newParams = this.getHashParams()
    let isChanged = false

    if (newParams.isRules != this.isRules) {
      isChanged = true
      this.isRules = newParams.isRules
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
    game.SetNewStateValues(game.state)
  }

  onChangeGameState(eventData: unknown) {
    const state = (eventData as ChangeGameStateData).detail
    let isChanged = false

    if (state.lang != this.lang) {
      isChanged = true
      this.lang = state.lang
    }

    if (state.isRules != this.isRules) {
      isChanged = true
      this.isRules = state.isRules
    }

    if (!isChanged) {
      return
    }

    let newHash = this.lang == Languages.eng ? '#en' : '#ru'

    if (this.isRules) {
      newHash += '/rules'
    }

    window.history.replaceState(null, '', newHash)
  }
}
