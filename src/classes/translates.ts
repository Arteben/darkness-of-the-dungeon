import { default as uiTranlates } from '@/translates/ui.json'

import { Languages } from '@/types/enums'
import { IJsonTranslatesType } from '@/types/main-types'
import { GameState } from '@/classes/game-state'

export class Translates {

  state: GameState

  constructor(state: GameState) {
    this.state = state
  }

  getLang() {
    const stateLang = this.state.lang
    return Languages[stateLang] as ('ru' | 'eng')
  }

  loc(text: string, pageTranslates?: IJsonTranslatesType) {
    const unknowWithoutLoc = (str: string) => `!!${str}!!`

    const translates: IJsonTranslatesType =
        pageTranslates ? pageTranslates : uiTranlates

    const lang = this.getLang()
    if (!lang){
      return unknowWithoutLoc(text)
    }

    const isLoc = typeof translates[text] == 'object' && typeof translates[text][lang] == 'string'
    return isLoc ? translates[text][lang] : unknowWithoutLoc(text)
  }
}
