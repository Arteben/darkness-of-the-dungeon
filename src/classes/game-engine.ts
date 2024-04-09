import { MineDarkness } from '@/classes/mine-darkness'

import {
  IWindowResolution, keyJumpFlags
} from '@/types/phaser-types'

import {
  Scene, Game, WEBGL, GameObjects, Types, Physics
} from 'phaser'

import * as phaserImgs from '@/imports/test-images'

class GameScene extends Scene {
  private _cursors: Types.Input.Keyboard.CursorKeys | undefined
  private _player: Types.Physics.Arcade.SpriteWithDynamicBody | undefined

  private _jumpEventFlags: keyJumpFlags = {
    isJump: false,
    isUpClick: false,
    timeout: NaN
  }

  constructor() {
    super('main-scene')
  }

  create() {
    this.add.image(0, 0, 'sky').setOrigin(0, 0)

    const platforms = this.physics.add.staticGroup()
    platforms.create()
    platforms.create(400, 568, 'ground').setScale(2).refreshBody()
    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    this._player = this.physics.add.sprite(100, 450, 'dude')

    this._player.setBounce(0.2)
    this._player.setCollideWorldBounds(true)

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    })

    this.physics.add.collider(this._player, platforms)

    this._cursors = this.input.keyboard?.createCursorKeys()
  }

  update(time: number, delta: number): void {
    if (!this._cursors || !this._player) { return }

    if (this._cursors.left.isDown) {
      this._player.setVelocityX(-160)

      this._player.anims.play('left', true)
    }
    else if (this._cursors.right.isDown) {
      this._player.setVelocityX(160)

      this._player.anims.play('right', true)
    }
    else {
      this._player.setVelocityX(0)

      this._player.anims.play('turn')
    }

    if (this._cursors.up.isUp) {
      this._jumpEventFlags.isJump = false
      this._jumpEventFlags.isUpClick = false
    }

    if (this._cursors.up.isDown && !this._jumpEventFlags.isUpClick) {
      this._jumpEventFlags.isJump = true
      this._jumpEventFlags.isUpClick = true
      this._jumpEventFlags.timeout = window.setTimeout(() => {
        this._jumpEventFlags.isJump = false
        window.clearTimeout(this._jumpEventFlags.timeout)
      }, 100)
    }

    if (this._jumpEventFlags.isJump && this._player.body.touching.down) {
      this._player.setVelocityY(-330)
    }
  }

  preload() {
    this.load.image('sky', phaserImgs.sky)
    this.load.image('star', phaserImgs.star)
    this.load.image('ground', phaserImgs.ground)
    this.load.image('bomb', phaserImgs.bomb)
    this.load.spritesheet('dude', phaserImgs.dude, { frameWidth: 32, frameHeight: 48 })
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
      canvas: element,
      parent,
      scene: [GameScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 300 },
          debug: false
        }
      },
    }

    this.engine = new Game(this.config)
  }

  getWindowResolutions(): IWindowResolution {
    return {
      width: window.screen.width,
      height: window.screen.height
    }
  }
}