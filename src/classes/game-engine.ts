import { MainEngineScene } from '@/classes/main-engine-scene'
import { GameState } from '@/classes/game-state'

import { IResolution } from '@/types/phaser-types'
import { Game, WEBGL, Types } from 'phaser'

export class GameEngine {
  configEngine: Types.Core.GameConfig
  gameState: GameState
  engine: Phaser.Game
  mainScene: MainEngineScene

  sceneResolution: IResolution = {
    width: 640,
    height: 384,
  }

  constructor(parent: HTMLElement, element: HTMLCanvasElement, state: GameState) {
    this.gameState = state
    this.mainScene = new MainEngineScene('main-scene')

    this.configEngine = {
      width: this.sceneResolution.width,
      height: this.sceneResolution.height,
      type: WEBGL,
      canvas: element,
      parent,
      scene: [this.mainScene],
      backgroundColor: '#1b262c',
      pixelArt: true,
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

    GameState.SubscribeAndUpdateStateChanges(this.onChangeState, this)

    window.addEventListener('resize',(event: UIEvent) => { this.onWindowResize() })
    this.onWindowResize()
  }

  private onChangeState () {
    if (this.gameState.isGame) {
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

    const gameProportion = this.sceneResolution.width / this.sceneResolution.height

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