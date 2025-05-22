
import {
  UserNotificationTypes,
  BusEventsList,
} from '@/types/enums'

import {
  INotificationData,
  INotificationAnimTimeouts,
  IUserModalData,
  IUserModalAddOptions,
} from '@/types/main-types'

import { getTOutPromise } from '@/utils/usefull'

import { GameState } from '@/classes/game-state'
import { EventBus } from '@/classes/event-bus'
import { Translates } from '@/classes/translates'

export class NotificationsModalsSystem {
  _state: GameState
  _logs: INotificationData[]
  _specAnimTimeouts: INotificationAnimTimeouts
  _isShownNotification: boolean = false
  _isShowModal: boolean = false
  _callbackForNotificationClicks: () => void
  _callbackModalOk: (e: CustomEventInit) => void
  loc: (str: string) => string
  argsLoc: (str: string, args: string[]) => string

  constructor(
    state: GameState, animTimeouts: INotificationAnimTimeouts, locals: Translates) {
    this._state = state
    this._logs = []
    this._specAnimTimeouts = animTimeouts

    this._callbackForNotificationClicks = () => {
      this.natificationTurnOff()
    }

    this._callbackModalOk = (event: CustomEventInit) => {
      this.userModalClose(event.detail?.options)
    }

    this.loc = (str: string) => locals.loc(str)
    this.argsLoc = (str: string, args: string[]) => {
      return locals.locWithArgs(str, args)
    }
  }

  getLastLog() {
    return this._logs[this._logs.length - 1]
  }

  spliceIfTooMany() {
    if (this._logs.length >= 20) {
      this._logs.splice(0, 10)
    }
  }

  showNotification(notData: INotificationData) {
    this._logs.push(notData)
    this.spliceIfTooMany()

    if (!this._isShownNotification && !this._isShowModal) {
      EventBus.On(BusEventsList[BusEventsList.notificationClick], this._callbackForNotificationClicks)
      this._isShownNotification = true
      this.showNotificationWithAnim(notData)
    }
  }

  async showNotificationWithAnim(currentNotification: INotificationData) {
    const isShownNatification = () => this._isShownNotification == true

    if (!isShownNatification() || this._logs.length <= 0) return

    const multyTimeNum = 1000

    this._state.userNotification = {
      type: UserNotificationTypes.start,
      text: currentNotification.text
    }
    await getTOutPromise(this._specAnimTimeouts.start * multyTimeNum)
    if (!isShownNatification()) return
    let counter = 0

    this._state.userNotification = {
      type: currentNotification.type,
      text: currentNotification.text,
    }

    const doMoreCalcs = 2
    const hold = this._specAnimTimeouts.hold * doMoreCalcs

    while (isShownNatification() && hold > counter) {
      if (currentNotification != this.getLastLog()) {
        this._state.userNotification = { type: UserNotificationTypes.break }
        await getTOutPromise(this._specAnimTimeouts.break * multyTimeNum)
        if (!isShownNatification()) return
        this.showNotificationWithAnim(this.getLastLog())
        return
      }
      await getTOutPromise(multyTimeNum / doMoreCalcs)
      counter++
    }

    if (isShownNatification()) {
      this.natificationTurnOff()
    }
  }

  natificationTurnOff() {
    EventBus.Off(BusEventsList[BusEventsList.notificationClick], this._callbackForNotificationClicks)
    this._state.userNotification = null
    this._isShownNotification = false
  }

  userModalClose(options?: IUserModalAddOptions[]) {
    this._state.userModal?.callback(options)
    EventBus.Off(BusEventsList[BusEventsList.userModalOk], this._callbackModalOk)
    this._isShowModal = false
    this._state.userModal = null
  }

  showModal(data: IUserModalData) {
    if (this._isShowModal) return

    this._isShowModal = true
    EventBus.On(BusEventsList[BusEventsList.userModalOk], this._callbackModalOk)

    if (this._isShownNotification) {
      this.natificationTurnOff()
    }

    this._state.userModal = data
  }
}