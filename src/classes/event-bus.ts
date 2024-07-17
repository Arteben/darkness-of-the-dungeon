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

  // 'this' here NOT WORK!!!!!!! use call for save it
  static On(name: string, callbackWihBindThis: (e: Event) => void) {
    eventBus.addEventListener(name, callbackWihBindThis)
  }

  static off(name: string, callback: (e: Event) => void) {
    eventBus.removeEventListener(name, callback)
  }
}
