import { BusEventsList } from '@/types/enums'

let eventBus: EventBus

export class EventBus {

  bus: HTMLElement

  constructor() {
    this.bus = document.createElement('darksOfTheDungeonBusEvent')
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

  // 'this' here NOT WORK!!!!!!! use call for save it
  // use arrow functions here (event: CustomEventInit) => {    }
  static On(name: string, callbackWihBindThis: (e: CustomEventInit) => void) {
    eventBus.addEventListener(name, callbackWihBindThis)
  }

  static off(name: string, callback: (e: Event) => void) {
    eventBus.removeEventListener(name, callback)
  }

  static subscribeStateChanges(callbackWihBindThis: (e: CustomEventInit) => void, that: any): (eventData: CustomEventInit) => void {
    const eventBusCallback = (eventData: CustomEventInit) => {
      callbackWihBindThis.call(that, eventData)
    }
    EventBus.On(BusEventsList[BusEventsList.changeGameState], eventBusCallback)
    return eventBusCallback
  }

  static subscribeAndUpdateStateChanges(callbackWihBindThis: (e: CustomEventInit) => void, that: any) {
    const eventBusCallback = EventBus.subscribeStateChanges(callbackWihBindThis, that)
    const data: CustomEventInit = { detail: null }
    callbackWihBindThis.call(that, data)
    return eventBusCallback
  }

  static offStateChangesSubscribe(callback: (eventData: CustomEventInit) => void) {
    EventBus.off(BusEventsList[BusEventsList.changeGameState], callback)
  }
}
