import { BusEventsList } from '@/types/enums'
import { Game } from '@/classes/mine-darkness'
import { ChangeGameStateData } from '@/types/main-types'

let eventBus: EventBus

export class EventBus {

  bus: HTMLElement

  constructor() {
    this.bus = document.createElement('darksOfMineBusEvent')
  }

  addEventListener(event: string, callback: (e: Event) => void) {
    this.bus.addEventListener(event, callback)
  }

  removeEventListener(event: string, callback: (e: Event) => void) {
    this.bus.removeEventListener(event, callback)
  }

  dispatchEvent<t>(typeEvent: string, detail: t) {
    this.bus.dispatchEvent(new CustomEvent(typeEvent, { detail }))
  }

  static Create() {
    eventBus = new EventBus()
  }

  static Dispatch<t>(name: string, data: t) {
    eventBus.dispatchEvent<t>(name, data)
  }

  // here need to bind for not allow this destraction!
  // for example: this.onChangeGameState = this.onChangeGameState.bind(this)
  static OnUsedItselfThis(name: string, callbackWihBindThis: (e: Event) => void) {
    eventBus.addEventListener(name, callbackWihBindThis)
  }

  static OnChangeGameStateItselfThis(callbackWihBindThis: (e: unknown) => void) {
    EventBus.OnUsedItselfThis(BusEventsList[BusEventsList.changeGameState], callbackWihBindThis)

    const game = Game()
    if (!game) {
      return
    }

    const data: ChangeGameStateData = { detail: game.state }
    callbackWihBindThis(data)
  }

  static off(name: string, callback: (e: Event) => void) {
    eventBus.removeEventListener(name, callback)
  }
}
