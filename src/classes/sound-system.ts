import {
  SoundLevels as lVs,
  BusEventsList,
  GameStateSettings,
  TypesOfSoundLevels,
  SoundLevels,
} from '@/types/enums'

import {
  ISoundLevelsCollection,
  ICommonSoundValues,
  GameStateChangeData,
} from '@/types/main-types'

import { EventBus } from '@/classes/event-bus'
import { MainEngine } from '@/classes/main-engine'

export const defaulSoundValues: ICommonSoundValues = {
  sfx: 0.5, music: 0.5
}

export const offSoundValues: ICommonSoundValues = {
  sfx: 0, music: 0
}

export class SoundSystem {
  _soundLevels: ISoundLevelsCollection
  // @ts-ignore
  _currentSoundValues: ICommonSoundValues

  constructor(
    engine: MainEngine, soundLevels: ISoundLevelsCollection, soundValues: ICommonSoundValues) {
    this._soundLevels = soundLevels
    this.setNewSoundVolumes(soundValues)

    EventBus.On(BusEventsList[BusEventsList.changeGameState], (event: CustomEventInit) => {
      if (!event.detail) return
      const data: GameStateChangeData = event.detail
      if (data.property != GameStateSettings.soundValues) return
      this.setNewSoundVolumes(soundValues)
    })
  }

  setNewSoundVolumes(newValues: ICommonSoundValues) {
    this._currentSoundValues = newValues

    const setNewVolume = (level: SoundLevels, newVolume: number) => {
      const sound = this._soundLevels[level].sound
      if (sound.isPlaying) {
        const seek = sound.seek
        const marker = sound.currentMarker
        this.stopLevelSound(level)
        sound.play(marker.name, {volume: newVolume, seek})
      }
    }

    const levels: string[] = Object.keys(this._soundLevels)
    levels.forEach((levelString: string) => {
      const level: lVs = Number(levelString)
      const volume = this.getVolumeForLevel(level)
      setNewVolume(level, volume)
    })
  }

  stopLevelSound(level: lVs) {
    const sound = this._soundLevels[level].sound
    if (sound.isPlaying) {
      sound.stop()
    }
  }

  getVolumeForLevel(level: lVs): number {
    const levelType = this._soundLevels[level].type

    switch (levelType) {
      case TypesOfSoundLevels.sfx:
        return this._currentSoundValues.sfx
      default:
        console.warn('for ', level, 'cant find any type!!!')
        return 0
    }
  }

  playSingleSoundForLevel(level: lVs, type: string) {
    this.stopLevelSound(level)
    const volume = this.getVolumeForLevel(level)
    const sound = this._soundLevels[level].sound
    sound.play(type, { volume })
  }
}
