import { LocSettingsList, BusEventsList } from '@/types/enums'
import { locSettingsValue, ILocSettingsEventLoad } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'

interface ILocSettings {
  isSound: boolean
  selectedMap?: string
}

export class GameLocSettings {
  locStorage: Storage
  storageKey = 'darknessOfTheMain'
  defaultLocSettings: ILocSettings = {
    isSound: true,
    selectedMap: undefined,
  }

  constructor() {
    this.locStorage = window.localStorage
    EventBus.On(BusEventsList[BusEventsList.changeLocSettings], (event: CustomEventInit) => {
      if (!event.detail)
        return

      const data: ILocSettingsEventLoad = event.detail
      this.setLocSettings(data.type, data.value)
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

  getLocSettings () {
    const data = this.getStorageData()
    return <ILocSettings>Object.assign({}, this.defaultLocSettings, data)
  }

  setLocSettings (type: LocSettingsList, value: locSettingsValue) {
    const oldData = this.getLocSettings()

    const setLocalSettings = (obj: object) => {
      const strData = JSON.stringify(obj)
      this.locStorage.setItem(this.storageKey, strData)
    }

    switch(type) {
      case LocSettingsList.isSound:
        setLocalSettings(Object.assign(oldData, {isSound: value}))
        break
      case LocSettingsList.selectedMap:
        setLocalSettings(Object.assign(oldData, {selectedMap: value}))
    }
  }
}
