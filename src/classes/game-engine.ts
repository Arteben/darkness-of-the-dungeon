import { MineDarkness } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'

import {
  IResolution
} from '@/types/phaser-types'

import {
  Scene, Game, WEBGL, GameObjects, Types, Physics
} from 'phaser'

import someFon from '@/assets/fon.png'

class MainEngineScene extends Scene {
  constructor(name: string) {
    super(name)
  }

  create() {
    this.add.image(0, 0, 'fon').setOrigin(0, 0)
  }

  update(time: number, delta: number): void {
  }

  preload() {
    this.load.image('fon', someFon)
  }
}

export class GameEngine {
  configEngine: Types.Core.GameConfig
  game: MineDarkness
  engine: Phaser.Game
  mainScene: MainEngineScene

  sceneResolution: IResolution = {
    width: 1000,
    height: 600
  }

  constructor(parent: HTMLElement, element: HTMLCanvasElement, game: MineDarkness) {
    this.game = game
    this.mainScene = new MainEngineScene('main-scene')

    this.configEngine = {
      width: this.sceneResolution.width,
      height: this.sceneResolution.height,
      type: WEBGL,
      canvas: element,
      parent,
      scene: [this.mainScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: false
        }
      },
    }

    this.engine = new Game(this.configEngine)
    this.engine.pause()

    EventBus.OnChangeGameStateItselfThis((eventData) => { this.onChangeState() })

    window.addEventListener('resize',(event: UIEvent) => { this.onWindowResize() })
    this.onWindowResize()
  }

  private onChangeState () {
    if (this.game.state.isGame) {
      if (this.engine.isPaused) { this.engine.resume() }
    } else if (!this.engine.isPaused) {
      this.engine.pause()
    }
  }

  private onWindowResize () {
    const winSizes: IResolution = {
      width: window.innerWidth, height: window.innerHeight,
    }

    const newSize: IResolution = {
      width: 0, height: 0,
    }

    const gameProportion = this.sceneResolution.width /
                                    this.sceneResolution.height

    if (winSizes.width > winSizes.height) {
      newSize.width = gameProportion * winSizes.height
      if (newSize.width > winSizes.width) {
        newSize.width = winSizes.width
        newSize.height = winSizes.width / gameProportion
      } else {
        newSize.height = winSizes.height
      }
    }  else {
      newSize.width = winSizes.width
      newSize.height =winSizes.width / gameProportion
    }

    this.engine.canvas.style.width = newSize.width + 'px'
    this.engine.canvas.style.height = newSize.height + 'px'
  }
}