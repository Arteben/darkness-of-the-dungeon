import { MineDarkness } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'

import {
  IWindowResolution, keyJumpFlags
} from '@/types/phaser-types'
import { ChangeGameStateData } from '@/types/main-types'

import {
  Scene, Game, WEBGL, GameObjects, Types, Physics
} from 'phaser'

import * as phaserImgs from '@/imports/test-images'

class MainEngineScene extends Scene {
  private _cursors: Types.Input.Keyboard.CursorKeys | undefined
  private _player: Types.Physics.Arcade.SpriteWithDynamicBody | undefined
  private _stars: Physics.Arcade.Group | undefined
  private _score: number = 0
  private _translatedScoreText = ' :'
  private _scoreText: GameObjects.Text | undefined
  private _bombs: Physics.Arcade.Group | undefined

  private _jumpEventFlags: keyJumpFlags = {
    isJump: false,
    isUpClick: false,
    timeout: null
  }

  constructor(name: string) {
    super(name)
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

    const scoreText = this._translatedScoreText + this._score
    this._scoreText = this.add.text(16, 50, scoreText, { fontSize: '32px', fill: '#000' } as Types.GameObjects.Text.TextStyle)

    this._stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    })

    this._stars.children.getArray().forEach((child: GameObjects.GameObject) => {
      (child as Phaser.Physics.Arcade.Sprite).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
    })

    this._bombs = this.physics.add.group()
    this.physics.add.collider(this._bombs, platforms)
    this.physics.add.collider(this._player, this._bombs, (player, bomb) => {
      this.physics.pause()
      const pl = player as Phaser.Physics.Arcade.Sprite
      pl.setTint(0xff0000)
      pl.anims.play('turn')
      // gameOver = true
    })

    this.physics.add.collider(this._stars, platforms)

    this.physics.add.overlap(this._player, this._stars, (player, star) => {
      (star as Phaser.Physics.Arcade.Sprite).disableBody(true, true)
      this._score += 10

      if (!this._stars) { return }
      if (this._stars.countActive(true) != 0) { return }

      this._stars.children.getArray().forEach((child) => {
        const star = child as Phaser.Physics.Arcade.Sprite
        star.enableBody(true, star.x, 0, true, true)
      })

      const pl = player as Phaser.Physics.Arcade.Sprite
      const coordX = (pl.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400)

      if (!this._bombs) { return }

      const bomb: Phaser.Physics.Arcade.Sprite = this._bombs.create(coordX, 16, 'bomb')
      bomb.setBounce(1)
      bomb.setCollideWorldBounds(true)
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    })
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
        window.clearTimeout(this._jumpEventFlags.timeout as number)
      }, 100)
    }

    if (this._jumpEventFlags.isJump && this._player.body.touching.down) {
      this._player.setVelocityY(-330)
    }


    const newText = this._translatedScoreText + this._score
    if (this._scoreText && this._scoreText.text != newText) {
      this._scoreText.setText(newText)
    }
  }

  preload() {
    this.load.image('sky', phaserImgs.sky)
    this.load.image('star', phaserImgs.star)
    this.load.image('ground', phaserImgs.ground)
    this.load.image('bomb', phaserImgs.bomb)
    this.load.spritesheet('dude', phaserImgs.dude, { frameWidth: 32, frameHeight: 48 })
  }

  setTranslatedScoreText(text: string) {
    this._translatedScoreText = text + ': '
  }
}

export class GameEngine {
  configEngine: Types.Core.GameConfig
  game: MineDarkness
  engine: Phaser.Game
  mainScene: MainEngineScene

  constructor(parent: HTMLElement, element: HTMLCanvasElement, game: MineDarkness) {
    this.game = game
    this.mainScene = new MainEngineScene('main-scene')

    this.configEngine = {
      width: 800,
      height: 600,
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

    this.onChangeState = this.onChangeState.bind(this)
    EventBus.OnChangeGameStateItselfThis(this.onChangeState)
  }

  onChangeState (eventData: unknown) {
    if (this.game.state.isGame) {
      if (this.engine.isPaused) { this.engine.resume() }
    } else if (!this.engine.isPaused) {
      this.engine.pause()
    }

    this.mainScene.setTranslatedScoreText(this.game.loc('phaserScore'))
  }

  getWindowResolutions(): IWindowResolution {
    return {
      width: window.screen.width,
      height: window.screen.height
    }
  }
}