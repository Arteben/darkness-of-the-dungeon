import {
  BusEventsList,
  GameStateSettings
} from '@/types/enums'
import {
  ILocSettings,
  GameStateChangeData
} from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
import { GameState } from './game-state'
import { defaulSoundValues } from '@/classes/sound-system'

export class GameLocSettings {
  locStorage: Storage
  storageKey = 'darknessOfTheMain'
  defaultLocSettings: ILocSettings = {
    soundValues: { ...defaulSoundValues },
    hasSoundOn: true,
    selectedMap: undefined,
    isShowGameIntro: true,
  }

  constructor() {
    this.locStorage = window.localStorage
    EventBus.On(BusEventsList[BusEventsList.changeGameState], (event: CustomEventInit) => {
      if (!event.detail) return
      const data: GameStateChangeData = event.detail

      let isExist = false
      const logSettingsKyes = Object.keys(this.defaultLocSettings)
      for (let i = 0; i < logSettingsKyes.length; i++) {
        if (logSettingsKyes[i] == GameStateSettings[data.property]) {
          isExist = true
          break
        }
      }

      if (isExist) {
        this.setLocSettings(data.property, data.state)
      }
    })
  }

  getStorageData() {
    let data: ILocSettings | null = null
    const rawData = this.locStorage.getItem(this.storageKey)

    if (!rawData) {
      return data
    }

    try {
      data = JSON.parse(rawData) as ILocSettings
      return data
    }
    catch (e) {
      console.error('error with parse local storage', e)
      return data
    }
  }

  getLocSettings() {
    const data = this.getStorageData()
    return <ILocSettings>Object.assign({}, this.defaultLocSettings, data)
  }

  setLocSettings(type: GameStateSettings, state: GameState) {
    const oldData = this.getLocSettings()

    const setLocalSettings = (key: string, statePar: any) => {
      const obj = Object.assign(oldData, { [key]: statePar })
      const strData = JSON.stringify(obj)
      this.locStorage.setItem(this.storageKey, strData)
    }

    switch (type) {
      case GameStateSettings.soundValues:
        setLocalSettings('soundValues', state.soundValues)
        break
      case GameStateSettings.hasSoundOn:
        setLocalSettings('hasSoundOn', state.hasSoundOn)
        break
      case GameStateSettings.selectedMap:
        setLocalSettings('selectedMap', state.selectedMap)
        break
      case GameStateSettings.isShowGameIntro:
        setLocalSettings('isShowGameIntro', state.isShowGameIntro)
    }
  }
}
