import { GameStateElement } from '@/classes/gamestate-element'

import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { FonMusicTypes, GameStateSettings } from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'
import { getRandomIntNumber } from '@/utils/usefull'

// songs
import crossingOverSong from '@assets/music/CrossingOver.ogg'
import hopeSleepsSong from '@assets/music/HopeSleeps.ogg'
import liketheFlamesSong from '@assets/music/LiketheFlames.ogg'
import theHumanAlgorithmSong from '@assets/music/TheHumanAlgorithm.ogg'

import introMusic from '@assets/music/_intro-music.ogg'
import endGameMusic from '@assets/music/_end-game.ogg'
//

const fonSongList = [
  crossingOverSong,
  hopeSleepsSong,
  liketheFlamesSong,
  theHumanAlgorithmSong,
]

const startEndMusic = [
  { type: FonMusicTypes.intro, file: introMusic },
  { type: FonMusicTypes.endMusic, file: endGameMusic },
]

interface startEndMusicAudio {
  type: FonMusicTypes
  audio: HTMLAudioElement
}


@customElement('fon-musics')
export class FonMusics extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.soundValues,
    GameStateSettings.hasSoundOn,
    GameStateSettings.typeFonMusic,
  ]

  _audioFonMusic: HTMLAudioElement = new Audio()
  _currentFonTrackIdx: number | null = null

  _startEndAudio: startEndMusicAudio[] = []
  _loaddedCountMusic = 0

  _typePlayMusic: FonMusicTypes = FonMusicTypes.none
  set typePlayMusic(type: FonMusicTypes) {
    if (this._typePlayMusic == type) return
    this.playForTypeMusic(type)
    this._typePlayMusic = type
  }
  get typePlayMusic(): FonMusicTypes {
    return this._typePlayMusic
  }

  _volume?: number
  set volume(value: number) {
    if (this._volume == value) return
    this._audioFonMusic.volume = value * 0.25
    this._startEndAudio.forEach(element => {
      element.audio.volume = value
    })
    this._volume = value
  }
  get volume(): number {
    return this._volume != undefined ? this._volume : 0
  }

  connectedCallback(): void {
    super.connectedCallback()
    this._audioFonMusic.onended = () => {
      if (this.typePlayMusic == FonMusicTypes.fon) {
        this.playFonMusic()
      }
    }

    startEndMusic.forEach(element => {
      const audio = new Audio()
      audio.src = element.file
      audio.oncanplaythrough = () => {
        this.onStartEndMusicLoad()
      }

      this._startEndAudio.push({
        type: element.type,
        audio,
      })
    })
  }

  playForTypeMusic(type: FonMusicTypes) {
    this.stopStartEndMusic()
    this._audioFonMusic.pause()
    this._audioFonMusic.currentTime = 0

    switch (type) {
      case FonMusicTypes.fon:
        this.stopStartEndMusic()
        this.playFonMusic()
        break
      case FonMusicTypes.none:
        break
      default:
        this.playStartEndMusic(type)
    }
  }

  playStartEndMusic(type: FonMusicTypes) {
    this._startEndAudio.find(element => {
      if (element.type == type) {
        element.audio.play()
        return true
      }
    })
  }

  stopStartEndMusic() {
    this._startEndAudio.forEach(element => {
      element.audio.pause()
      element.audio.currentTime = 0
    })
  }

  playFonMusic() {
    const idx = this.getNextFonTrackFonIndex()
    this._audioFonMusic.src = fonSongList[idx]
    this._audioFonMusic.play()
  }

  getNextFonTrackFonIndex() {
    const getNextIndex = () => {
      return getRandomIntNumber(1, fonSongList.length) - 1
    }

    if (this._currentFonTrackIdx == null) {
      return getNextIndex()
    }

    const attemptMaxCount = 3
    let seachedIdx: null | number = null
    let attempt = 0

    while (attemptMaxCount > attempt && seachedIdx == null) {
      const idx = getNextIndex()
      if (idx != this._currentFonTrackIdx) {
        seachedIdx = idx
      } else {
        attempt++
      }
    }

    return seachedIdx || 0
  }

  onStartEndMusicLoad() {
    this._loaddedCountMusic++
    // if (this._loaddedCountMusic == startEndMusic.length) {
    //   console.log('all music loaded! ++++++++++++')
    // }
  }

  getVolume() {
    return (!this._state?.hasSoundOn) ? 0 : this._state.soundValues.music
  }

  renderWithGame() {
    this.volume = this.getVolume()
    this.typePlayMusic = this._state.typeFonMusic
    return html``
  }
}
