import { Scene, GameObjects, Types, Physics } from 'phaser'

import {
  SoundLevels,
} from '@/types/enums'

import {
  IAudioSpriteCollection
} from '@/types/main-types'

import { MainEngine } from '@/classes/main-engine'

export class SoundSystem {
  _soundLevels: IAudioSpriteCollection

  constructor(engine: MainEngine, soundLevels: IAudioSpriteCollection) {
    this._soundLevels = soundLevels
  }

  stopLevelTypeSound(level: SoundLevels) {
    if (this._soundLevels[level].isPlaying) {
      this._soundLevels[level].stop()
    }
  }

  playLevelTypeSound(level: SoundLevels,type: string) {
    this._soundLevels[level]
    this.stopLevelTypeSound(level)
    this._soundLevels[level].play(type)
  }
}
