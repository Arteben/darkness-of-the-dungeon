import { MineDarkness } from '@/classes/mine-darkness'

import {
  IWindowResolution
} from '@/types/phaser-types'

import {
  Scene, Game, WEBGL, GameObjects, Types
} from 'phaser'

import * as phaserImgs from '@/imports/test-images'

class GameScene extends Scene {
  constructor() {
    super('main-scene')
  }

  create () {
    this.add.image(400, 300, 'sky')
    this.add.image(400, 300, 'star')
  }

  preload () {
    this.load.image('sky', phaserImgs.sky)
    this.load.image('star', phaserImgs.star)
  }
}

export class GameEngine {

  config: Types.Core.GameConfig
  game: MineDarkness
  engine: Phaser.Game

  constructor(parent: HTMLElement, element: HTMLCanvasElement, game: MineDarkness) {
    this.game = game

    if (!this.game.gameApp.shadowRoot) null

    this.config = {
      // width: this.getWindowResolutions().width,
      // height: this.getWindowResolutions().height,
      width: 800,
      height: 600,
      type: WEBGL,
      scene: [ GameScene ],
      canvas: element,
      parent,
    }

    this.engine = new Game(this.config)
  }

  getWindowResolutions (): IWindowResolution {
    return {
      width: window.screen.width,
      height: window.screen.height
    }
  }
}