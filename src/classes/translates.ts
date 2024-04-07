import { default as uiTranlates } from '@/translates/ui.json'

import { MineDarkness } from '@/classes/mine-darkness'
import { Languages } from '@/types/enums'
import { IJsonTranslatesType } from '@/types/main-types'

export class Translates {

  game: MineDarkness | undefined

  private getLang() {
    if (!this.game) return

    const stateLang = this.game.state.lang
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
