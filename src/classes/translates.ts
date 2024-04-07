import { default as uiTranlates } from '@/translates/ui.json'

import { MineDarkness } from '@/classes/mine-darkness'
import { jsonTranslateFiles, Languages } from '@/types/enums'
import { IJsonTranslatesType } from '@/types/main-types'

export class Translates {

  game: MineDarkness | undefined

  private getLang() {
    if (!this.game) return

    const stateLang = this.game.state.lang
    return Languages[stateLang] as ('ru' | 'eng')
  }

  loc(text: string, type?: jsonTranslateFiles) {
    const unknowWithoutLoc = (str: string) => `!!${str}!!`

    let translates: IJsonTranslatesType

    if (!type) {
      type = jsonTranslateFiles.uiTranslates
    }

    switch (type) {
      case jsonTranslateFiles.uiTranslates:
        translates = uiTranlates
        break
      default:
        return unknowWithoutLoc(text)
    }

    const lang = this.getLang()
    if (!lang){
      return unknowWithoutLoc(text)
    }

    const isLoc = typeof translates[text] == 'object' && typeof translates[text][lang] == 'string'
    return isLoc ? translates[text][lang] : unknowWithoutLoc(text)
  }
}
