import {
  SoundLevels as lVs,
  BusEventsList,
  TypesOfSoundLevels,
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

export const onSoundValues: ICommonSoundValues = {
  sfx: 1, music: 1
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

    EventBus.On(BusEventsList[BusEventsList.setSoundValues], (event: CustomEventInit) => {
      if (!event.detail) return
      this.setNewSoundVolumes(event.detail)
    })
  }

  addNewSoundLevel(idx: string, sprite: lVs, type: TypesOfSoundLevels) {
    this._soundLevels[idx] = {
      sound: <Phaser.Sound.WebAudioSound>this._engineSound.addAudioSprite(lVs[sprite]),
      type,
    }
  }

  deleteSoundLevel(idx: string) {
    const soundLevel = this._soundLevels[idx]
    if (soundLevel == undefined) return

    this.stopLevelSound(idx)
    delete this._soundLevels[idx]
  }

  setNewSoundVolumes(newValues: ICommonSoundValues) {
    this._state.soundValues = newValues

    const setNewVolume = (levelIdx: string, newVolume: number) => {
      const sound = this._soundLevels[levelIdx].sound
      if (sound.isPlaying) {
        const seek = sound.seek
        const marker = sound.currentMarker
        this.stopLevelSound(levelIdx)
        sound.play(marker.name, { volume: newVolume, seek })
      }
    }

    const levelStrs: string[] = Object.keys(this._soundLevels)
    levelStrs.forEach((levelStr: string) => {
      const volume = this.getVolumeForLevel(levelStr)
      setNewVolume(levelStr, volume)
    })
  }

  stopLevelSound(levelIdx: string) {
    const soundLevel = this._soundLevels[levelIdx]
    if (soundLevel == undefined) return

    if (soundLevel.sound.isPlaying) {
      soundLevel.sound.stop()
    }
  }

  getVolumeForLevel(levelIdx: string): number {
    switch (this._soundLevels[levelIdx]?.type) {
      case TypesOfSoundLevels.sfx:
        return this._state.soundValues.sfx
      default:
        console.warn('for ', levelIdx, 'cant find any type!!!')
        return 0
    }
  }

  playSingleSoundForLevel(levelIdx: string, type: string) {
    const soundLevel = this._soundLevels[levelIdx]
    if (soundLevel == undefined) return

    this.stopLevelSound(levelIdx)
    const volume = this.getVolumeForLevel(levelIdx)
    const sound = soundLevel.sound
    sound.play(type, { volume })
  }
}
