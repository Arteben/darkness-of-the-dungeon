
import { MineDarkness } from '@/classes/mine-darkness'
import {
  IPhaserConfig,
  IWindowResolution
} from '@/types/phaser-types'
import Phaser from 'phaser'
// import Phaser from 'phaser'

import skyImg from '@/assets/sky.png'
// import groundimg from '@/assets/platform.png'
import starImg from '@/assets/star.png'
// import bombImg from '@/assets/bomb.png'
// import dudeImg from '@/assets/dude.png'

function phaserPreload (this: Phaser.Scene) {
  this.load.image('sky', skyImg)
  // this.load.image('ground', groundimg)
  this.load.image('star', starImg)
  // this.load.image('bomb', '@/assets/bomb.png')
  // this.load.spritesheet('dude',
  //     '@/assets/dude.png',
  //     { frameWidth: 32, frameHeight: 48 }
  // )
}
function phaserCreate (this: Phaser.Scene) {
  this.add.image(400, 300, 'sky')
  this.add.image(400, 300, 'star')
}

function phaserUpdate () {}

export class GameEngine {

  config: IPhaserConfig
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
      type: Phaser.WEBGL,
      scene: {
        preload: phaserPreload,
        create: phaserCreate,
        update: phaserUpdate
      },
      canvas: element,
      parent,
    }

    this.engine = new Phaser.Game(this.config)
  }

  getWindowResolutions (): IWindowResolution {
    return {
      width: window.screen.width,
      height: window.screen.height
    }
  }
}