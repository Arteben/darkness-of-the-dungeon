import { EventBus } from '@/classes/event-bus'

import {
  getRandomIntNumber,
  getTOutPromise,
} from '@/utils/usefull'

import {
  ITilesCoords,
  DroppedItemsList,
  StaticEnvElementCallback,
} from '@/types/main-types'

import {
  BusEventsList,
  ProgressBarTypes,
  PocketItemsEnum,
} from '@/types/enums'

import { Dude } from '@/classes/dude'

const filledBarKey = 'filled!'

export class MapStaticElement {
  toolType: PocketItemsEnum
  iconTip: number
  // @ts-ignore
  isInteractive: boolean
  _useCallback: StaticEnvElementCallback
  _tileLayer: Phaser.Tilemaps.TilemapLayer
  _eventBusFunc: (data: CustomEventInit) => void
  _fillBar: boolean = false
  // seconds * 10
  _fillBarTime: number


  constructor(
    layer: Phaser.Tilemaps.TilemapLayer,
    tip: number,
    callback: StaticEnvElementCallback,
    time: number = 1,
    pocketItemType: PocketItemsEnum = PocketItemsEnum.hand,
  ) {
    this._tileLayer = layer
    this.iconTip = tip
    this._useCallback = callback
    this.toolType = pocketItemType

    this._eventBusFunc = (data: CustomEventInit) => {
      if (data && data.detail && data.detail == this) {
        this._fillBar = false
      }
    }

    this._fillBarTime = time * 10

    this.setInteractive(true)
  }

  setInteractive(flag: boolean) {
    if (flag) {
      EventBus.On(BusEventsList[BusEventsList.charTwitching], this._eventBusFunc)
    } else {
      EventBus.off(BusEventsList[BusEventsList.charTwitching], this._eventBusFunc)
    }
    this.isInteractive = flag
  }

  use(coords: ITilesCoords, char: Dude) {
    if (this._fillBar || !this.isInteractive) return

    (async () => {
      try {
        const resultBarFill = await this.getProgressBarPromise(char)
        if (resultBarFill == filledBarKey) {
          this._useCallback(coords, char)
        }
      } catch (err) { }
    })()
  }

  isCorrectToolType(type: PocketItemsEnum) {
    return this.toolType == type
  }

  getProgressBarPromise(char: Dude): Promise<string> {
    const getTimePercents = (num: number) => 100 * num / this._fillBarTime

    return new Promise(async (resolve, reject) => {
      let counter = 1
      this._fillBar = true
      while (this._fillBarTime >= counter - 1 && this._fillBar) {
        await getTOutPromise(100)
        if (this._fillBarTime == counter - 1) {
          char.progressBarValues = null
          this._fillBar = false
          resolve(filledBarKey)
        } else {
          char.progressBarValues = { progress: getTimePercents(counter), type: ProgressBarTypes.usual }
          counter++
        }
      }

      this._fillBar = false
      char.progressBarValues = null
      reject('')
    })
  }
}

export class BoxStaticElement extends MapStaticElement {
  constructor(
    layer: Phaser.Tilemaps.TilemapLayer,
    tip: number,
    time: number,
    list: DroppedItemsList,
  ) {
    const callback = (coords: ITilesCoords, char: Dude) => {
      const droppedElement = list[getRandomIntNumber(1, list.length) - 1]
      char._dropItems.drop(coords, droppedElement)
      this.setInteractive(false)
      console.log('set interactive false for this ', this)
    }
    super(layer, tip, callback, time)
  }
}
