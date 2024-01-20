

let eventBus: EventBus

export class EventBus {

    bus: HTMLElement

    constructor()
    {
        this.bus = document.createElement('darksOfMineBusEvent')
    }

    addEventListener(event, callback)
    {
        this.bus.addEventListener(event, callback)
    }

    removeEventListener(event, callback)
    {
        this.bus.removeEventListener(event, callback);
    }

    dispatchEvent(event, detail = {})
    {
        this.bus.dispatchEvent(new CustomEvent(event, { detail }))
    }

    static Create () {
      eventBus = new EventBus()
    }

    static Dispatch (name: string, data: any) {
      eventBus.dispatchEvent(name, data)
    }

    static On (name: string, callback: (e) => void) {
      eventBus.addEventListener(name, callback)
    }

    static off (name: string, callback: (e) => void) {
      eventBus.removeEventListener(name, callback)
    }
}