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

export class GameLocSettings {
  locStorage: Storage
  storageKey = 'darknessOfTheMain'
  defaultLocSettings: ILocSettings = {
    isSound: true,
    selectedMap: undefined,
  }

  constructor() {
    this.locStorage = window.localStorage
    EventBus.On(BusEventsList[BusEventsList.changeGameState], (event: CustomEventInit) => {
      if (!event.detail) return
      const data: GameStateChangeData = event.detail
      if (data.property != GameStateSettings.selectedMap
                        && data.property != GameStateSettings.isSound) {
          return
        }
    this.setLocSettings(data.property, data.state)
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

  const setLocalSettings = (obj: object) => {
    const strData = JSON.stringify(obj)
    this.locStorage.setItem(this.storageKey, strData)
  }

  switch (type) {
    case GameStateSettings.isSound:
      setLocalSettings(Object.assign(oldData, { isSound: state.isSound }))
      break
    case GameStateSettings.selectedMap:
      setLocalSettings(Object.assign(oldData, { selectedMap: state.selectedMap }))
  }
}
}
