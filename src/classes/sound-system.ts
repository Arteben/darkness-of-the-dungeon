import { Scene, GameObjects, Types, Physics } from 'phaser'

import { SoundLevels } from '@/types/enums'

import {
  IAudioSpriteCollection
} from '@/types/main-types'

import { MainEngine } from '@/classes/main-engine'

export class SoundSystem {
  _soundLevels: IAudioSpriteCollection


  constructor(engine: MainEngine, soundLevels: IAudioSpriteCollection) {
    this._soundLevels = soundLevels
    // this._soundLevels[SoundLevels.DudeUsualActions].stop()
  }
}
