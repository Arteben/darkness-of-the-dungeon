import {
  SoundLevels as lVs,
  BusEventsList,
  FonMusicTypes,
} from '@/types/enums'

import {
  ISoundLevelsCollection,
  ICommonSoundValues,
} from '@/types/main-types'

import { Game as PhaserGame } from 'phaser'
import { EventBus } from '@/classes/event-bus'
import { GameState } from '@/classes/game-state'

export const defaulSoundValues: ICommonSoundValues = {
  sfx: 0.1, music: 0.2
}

export const offSoundValues: ICommonSoundValues = {
  sfx: 0, music: 0
}

export class SoundSystem {
  _soundLevels: ISoundLevelsCollection
  _engineSound: Phaser.Sound.WebAudioSoundManager
  _state: GameState

  constructor(
    phaser: PhaserGame, state: GameState) {
    this._soundLevels = {}
    this._engineSound = phaser.sound as Phaser.Sound.WebAudioSoundManager
    this._state = state

    EventBus.On(BusEventsList[BusEventsList.setSoundValues], (event: CustomEventInit) => {
      const values: ICommonSoundValues = event.detail
      if (!values) return
      this.setSoundVolumes(values)
      this.applyNewSfxValue()
    })

    EventBus.On(BusEventsList[BusEventsList.turnSoundOn], (event: CustomEventInit) => {
      const flag: boolean = Boolean(event.detail)
      this._state.hasSoundOn = flag
      this.applyNewSfxValue()
    })
  }

  setSoundVolumes(newValues: ICommonSoundValues) {
    const setValue = (num: number) => {
      if (num > 0) {
        return num > 1 ? 1 : num
      } else {
        return 0
      }
    }

    const values: ICommonSoundValues = {
      music: setValue(newValues.music),
      sfx: setValue(newValues.sfx),
    }

    this._state.soundValues = values
  }

  applyNewSfxValue() {
    const sfxValue = this._state.hasSoundOn
      ? this._state.soundValues.sfx
      : 0
    this._engineSound.setVolume(sfxValue)
  }

  addNewSfxLevel(idx: string, sprite: lVs) {
    if (!this._soundLevels[idx]) {
      this._soundLevels[idx] =
        <Phaser.Sound.WebAudioSound>this._engineSound.addAudioSprite(lVs[sprite])
    }
  }

  deleteSfxLevel(idx: string) {
    const soundLevel = this._soundLevels[idx]
    if (soundLevel == undefined) return

    this.stopAllSoundLevel(idx)
    soundLevel.destroy()
    delete this._soundLevels[idx]
  }

  stopAllSoundLevel(levelIdx: string) {
    const soundLevel = this._soundLevels[levelIdx]
    if (soundLevel == undefined) return

    if (soundLevel.isPlaying) {
      soundLevel.stop()
    }
  }

  playLevelStaticSound(levelIdx: string, type: string) {
    const soundLevel = this._soundLevels[levelIdx]
    if (soundLevel == undefined) return

    this.stopAllSoundLevel(levelIdx)
    const volume = this._state.soundValues.sfx
    const sound = soundLevel
    sound.play(type, { volume })
  }

  setFonMusic(type: FonMusicTypes) {
    this._state.typeFonMusic = type
  }
}
