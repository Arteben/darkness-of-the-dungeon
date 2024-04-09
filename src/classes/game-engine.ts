
import { MineDarkness } from '@/classes/mine-darkness'
import {
  IPhaserConfig,
  IWindowResolution
} from '@/types/phaser-types'
// import Phaser from 'phaser'

export class GameEngine {

  config: IPhaserConfig = {
  }

  constructor(element: HTMLCanvasElement, game: MineDarkness) {
    console.log('canvas', element)
  }

  getWindowResolutions (): IWindowResolution {
    return {
      width: window.screen.width,
      height: window.screen.height
    }
  }
}