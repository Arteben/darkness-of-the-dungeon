import '@/ui/menu-button'
import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('main-menu')
export class MainMenu extends LitElement {
  render() {
    return html`
        <menu-button title="Страрт новой игры"></menu-button>
        <menu-button title="Правила"></menu-button>
        <menu-button title="Переключить звук"></menu-button>
        <menu-button title="Сменить язык"></menu-button>
    `
  }

  static styles = css`
    :host {
      position: fixed;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
  `
}
