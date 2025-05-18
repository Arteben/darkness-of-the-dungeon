
import {
  UserNotificationTypes,
  BusEventsList,
} from '@/types/enums'

import {
  INotificationData,
  INotificationAnimTimeouts,
} from '@/types/main-types'

import { getTOutPromise } from '@/utils/usefull'

import { GameState } from '@/classes/game-state'
import { EventBus } from '@/classes/event-bus'

export class NotificationsModalsSystem {
  _state: GameState
  _logs: INotificationData[]
  _specAnimTimeouts: INotificationAnimTimeouts
  _isShownNotification: boolean = false

  constructor(state: GameState, animTimeouts: INotificationAnimTimeouts) {
    this._state = state
    this._logs = []
    this._specAnimTimeouts = animTimeouts
  }

  showNotification(notData: INotificationData) {
    this._logs.push(notData)
    if (!this._isShownNotification) {
      this._isShownNotification = true
      this.showNotificationWithAnim(notData)
    }
  }

  async showNotificationWithAnim(currentNotification: INotificationData) {
    const isShownNatification = () => this._isShownNotification == true

    if (!isShownNatification() || this._logs.length <= 0) return

    const getLastLog = () => this._logs[this._logs.length - 1]
    const multyTimeNum = 1000

    this._state.userNotification = { type: UserNotificationTypes.start }
    await getTOutPromise(this._specAnimTimeouts.start * multyTimeNum)
    if (!isShownNatification()) return
    let counter = 0

    this._state.userNotification = {
      type: currentNotification.type,
      text: currentNotification.text,
    }

    while(isShownNatification() && this._specAnimTimeouts.hold > counter) {
      if (currentNotification != getLastLog()) {
        this._state.userNotification = { type: UserNotificationTypes.break }
        await getTOutPromise(this._specAnimTimeouts.break * multyTimeNum)
        this.showNotificationWithAnim(getLastLog())
        return
      }
      await getTOutPromise(multyTimeNum)
      counter++
    }

    if (isShownNatification()) {
      this.natificationTurnOff()
    }
  }

  natificationTurnOff() {
    this._state.userNotification = null
    this._isShownNotification = false
  }
}