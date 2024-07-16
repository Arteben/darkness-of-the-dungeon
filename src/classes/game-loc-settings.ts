import { LocSettingsList } from '@/types/enums'
import { LocSettings, locSettingsValue } from '@/types/main-types'
import { EventBus } from '@/classes/event-bus'
// import { Game } from '@/classes/mine-darkness'

export class GameLocSettings {
  locStorage: Storage
  storageKey = 'darknessOfTheMain'
  defaultLocSettings: LocSettings = {
    isSound: true,
    selectedMap: undefined,
  }

  constructor() {
    this.locStorage = window.localStorage
    // EventBus.OnUsedItselfThis(BusEventsList[BusEventsList.changeGameState], callbackWihBindThis)
  }

  getStorageData() {
    let data: LocSettings | null = null
    const rawData = this.locStorage.getItem(this.storageKey)

    if (!rawData) {
      return data
    }

    try {
      data = JSON.parse(rawData) as LocSettings
      return data
    }
    catch (e) {
      console.error('error with parse local storage', e)
      return data
    }
  }

  getLocSettings () {
    const data = this.getStorageData()
    return <LocSettings>Object.assign({}, this.defaultLocSettings, data)
  }

  // onLocSettingChange (type, ) {
  // }

  setLocSettings (type: LocSettingsList, value: locSettingsValue) {
    const oldData = this.getLocSettings()

    const setLocalSettings = (obj: object) => {
      const strData = JSON.stringify(obj)
      this.locStorage.setItem(this.storageKey, strData)
    }

    switch(type) {
      case LocSettingsList.isSound:
        setLocalSettings(Object.assign(oldData, {isSound: <boolean>value}))
        break
      case LocSettingsList.selectedMap:
        setLocalSettings(Object.assign(oldData, {selectedMap: <string>value}))
    }
  }
}
