import { GameStateElement } from '@/classes/gamestate-element'

import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { GamePages, GameStateSettings } from '@/types/enums'
import { NullOrGameStateSettings } from '@/types/main-types'
import { getRandomIntNumber } from '@/utils/usefull'

// songs
import crossingOverSong from '@/assets/music/CrossingOver.ogg'
import hopeSleepsSong from '@/assets/music/HopeSleeps.ogg'
import liketheFlamesSong from '@/assets/music/LiketheFlames.ogg'
import theHumanAlgorithmSong from '@/assets/music/TheHumanAlgorithm.ogg'
//

const songsList = [
  crossingOverSong,
  hopeSleepsSong,
  liketheFlamesSong,
  theHumanAlgorithmSong,
]

@customElement('fon-musics')
export class FonMusics extends GameStateElement {

  _stateSettings: NullOrGameStateSettings = [
    GameStateSettings.soundValues,
    GameStateSettings.isGameStarted,
    GameStateSettings.pages,
    GameStateSettings.hasSoundOn,
  ]

  audio: HTMLAudioElement = new Audio()
  currentTrackIdx: number | null = null

  _isPlaying: boolean = false
  set isPlaying(flag: boolean) {
    if (flag == this._isPlaying && !flag) return

    if (flag) {
      this.audio.play()
    } else {
      this.audio.pause()
      this.audio.currentTime = 0
    }
    this._isPlaying = flag
  }
  get isPlaying(): boolean {
    return this._isPlaying
  }

  _volume?: number
  set volume(value: number) {
    if (this._volume == value) return
    this.audio.volume = value
    this._volume = value
    if (value > 0 && this.isPlaying) {
      this.isPlaying = true
    }
  }
  get volume(): number {
    return !this._volume ? 0 : this._volume
  }


  connectedCallback(): void {
    super.connectedCallback()
    this.volume = 0
    this.audio.onended = () => {
      if (this.isPlaying && this.setSrcAudio()) {
        this.isPlaying = true
      }
    }
  }

  setSrcAudio() {
    const idx = this.getNextTrackIndex()
    if (idx == null || idx >= songsList.length) {
      return false
    }

    this.audio.src = songsList[idx]
    return true
  }

  getNextTrackIndex() {
    const getNextIndex = () => {
      return getRandomIntNumber(1, songsList.length) - 1
    }

    if (this.currentTrackIdx == null) {
      return getNextIndex()
    }

    const attemptMaxCount = 3
    let seachedIdx: null | number = null
    let attempt = 0

    while (attemptMaxCount > attempt && seachedIdx == null) {
      const idx = getNextIndex()
      if (idx != this.currentTrackIdx) {
        seachedIdx = idx
      } else {
        attempt++
      }
    }

    return seachedIdx
  }

  getVolume() {
    return (!this._state?.hasSoundOn) ? 0 : this._state.soundValues.music / 5
  }

  renderWithGame() {
    this.volume = this.getVolume()

    const isPlaying = this._state.page == GamePages.game && this._state.isGameStarted
    if (isPlaying != this.isPlaying) {
      this.isPlaying = isPlaying && this.setSrcAudio()
    }
    return html``
  }
}
