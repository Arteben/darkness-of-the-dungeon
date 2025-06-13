import {
  SoundLevels as lVs,
  BusEventsList,
  GameStateSettings,
} from '@/types/enums'

import {
  ISoundLevelsCollection,
  ICommonSoundValues,
} from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { MainEngine } from '@/classes/main-engine'
import { GameState } from '@/classes/game-state'

export const defaulSoundValues: ICommonSoundValues = {
  sfx: 0.5, music: 0.5
}

export const offSoundValues: ICommonSoundValues = {
  sfx: 0, music: 0
}

export class SoundSystem {
  _soundLevels: ISoundLevelsCollection
  _engineSound: Phaser.Sound.WebAudioSoundManager
  _state: GameState

  constructor(
    engine: MainEngine, state: GameState) {
    this._soundLevels = {}
    this._engineSound = engine.sound as Phaser.Sound.WebAudioSoundManager
    this._state = state

    EventBus.On(BusEventsList[BusEventsList.changeGameState], (event: CustomEventInit) => {
      const details = event.detail
      if (!details &&
        (details?.property != GameStateSettings.soundValues || details?.property != GameStateSettings.hasSoundOn)) {
        return
      }
      this.setNewSoundVolumes()
    })
  }

  addNewSfxLevel(idx: string, sprite: lVs) {
    this._soundLevels[idx] =
      <Phaser.Sound.WebAudioSound>this._engineSound.addAudioSprite(lVs[sprite])
  }

  deleteSfxLevel(idx: string) {
    const soundLevel = this._soundLevels[idx]
    if (soundLevel == undefined) return

    this.stopLevelSound(idx)
    soundLevel.destroy()
    delete this._soundLevels[idx]
  }

  setNewSoundVolumes() {
    this._engineSound.setVolume(this._state.soundValues.sfx)
  }

  stopLevelSound(levelIdx: string) {
    const soundLevel = this._soundLevels[levelIdx]
    if (soundLevel == undefined) return

    if (soundLevel.isPlaying) {
      soundLevel.stop()
    }
  }

  playSfxSoundForLevel(levelIdx: string, type: string) {
    const soundLevel = this._soundLevels[levelIdx]
    if (soundLevel == undefined) return

    this.stopLevelSound(levelIdx)
    const volume = this._state.soundValues.sfx
    const sound = soundLevel
    sound.play(type, { volume })
  }
}
