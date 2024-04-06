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
  //
  static On(name: string, callback: (e: Event) => void, that: any) {
    if (!that) {
      console.error(`you dont set bind for function  ${String(callback)}`)
    }
    eventBus.addEventListener(name, callback)
  }

  static OnArrowFunc(name: string, callback: (e: Event) => void) {
    eventBus.addEventListener(name, callback)
  }

  static off(name: string, callback: (e: Event) => void) {
    eventBus.removeEventListener(name, callback)
  }
}
