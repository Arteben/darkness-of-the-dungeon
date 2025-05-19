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
  EnvStaticElements,
} from '@/types/enums'

import { Dude } from '@/classes/dude'
import { EnvStaticMapElements } from '@/classes/env-static-map-elements'

const filledBarKey = 'filled!'

export class MapStaticElement {
  toolType: PocketItemsEnum
  iconTip: number
  // @ts-ignore
  isInteractive: boolean
  _useCallback: StaticEnvElementCallback
  _staticElements: EnvStaticMapElements
  _eventBusFunc: (data: CustomEventInit) => void
  _fillBar: boolean = false
  // seconds * 10
  _fillBarTime: number
  _nonInteractiveTile: EnvStaticElements
  _tileIndex: EnvStaticElements
  _coords: ITilesCoords

  constructor(
    staticElements: EnvStaticMapElements,
    tileIndex: EnvStaticElements,
    noInterTileIndex: EnvStaticElements,
    coords: ITilesCoords,
    tip: number,
    callback: StaticEnvElementCallback,
    time: number = 1,
    pocketItemType: PocketItemsEnum = PocketItemsEnum.hand,
    isInteractive: boolean = true,
  ) {
    this._staticElements = staticElements
    this.iconTip = tip
    this._useCallback = callback
    this.toolType = pocketItemType
    this._tileIndex = tileIndex
    this._nonInteractiveTile = noInterTileIndex
    this._coords = coords

    this._eventBusFunc = (data: CustomEventInit) => {
      if (data && data.detail && data.detail == this) {
        this._fillBar = false
      }
    }

    this._fillBarTime = time * 10

    this.setInteractive(isInteractive, true)
  }

  setInteractive(flag: boolean, isStart = false) {
    let changeTile = (n: EnvStaticElements, o: EnvStaticElements) => { }

    if (!isStart) {
      changeTile = (newtile: EnvStaticElements, oldTile: EnvStaticElements) => {
        const isPushed = this._staticElements.pushNewElement(this._coords, newtile, oldTile)
        if (isPushed) {
          this._staticElements.changeLayerTile(this._coords, newtile)
        }
      }
    }

    if (flag) {
      changeTile(this._tileIndex, this._nonInteractiveTile)
      EventBus.On(BusEventsList[BusEventsList.charTwitching], this._eventBusFunc)
    } else {
      changeTile(this._nonInteractiveTile, this._tileIndex)
      EventBus.Off(BusEventsList[BusEventsList.charTwitching], this._eventBusFunc)
    }

    this.isInteractive = flag
  }

  async use(char: Dude) {
    if (this._fillBar || !this.isInteractive) return

    try {
      const resultBarFill = await this.getProgressBarPromise(char)
      if (resultBarFill == filledBarKey) {
        this._useCallback(this, this._coords, char)
      }
    } catch (err) { }
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
    staticElements: EnvStaticMapElements,
    tile: EnvStaticElements,
    notInteractiveTile: EnvStaticElements,
    coords: ITilesCoords,
    tip: number,
    list: DroppedItemsList,
    isAlwaysFull: boolean = true,
  ) {
    const callback = function (that: MapStaticElement, coords: ITilesCoords, char: Dude) {
      const isFullBox = isAlwaysFull || getRandomIntNumber(1, 2) == 1
      if (isFullBox) {
        const droppedElement = list[getRandomIntNumber(1, list.length) - 1]
        char.dropItems.drop(coords, droppedElement)
      }

      that.setInteractive(false)
    }

    const time = getRandomIntNumber(2, 5)

    super(staticElements, tile, notInteractiveTile, coords, tip, callback, time)
  }
}
