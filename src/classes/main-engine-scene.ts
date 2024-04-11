import { Scene, GameObjects, Types, Physics } from 'phaser'

export class MainEngineScene extends Scene {
  _progress: GameObjects.Graphics | undefined

  constructor(name: string) {
    super(name)
  }

  create() {
  }

  update(time: number, delta: number): void {
  }

  preload() {
    const progressBar = this._progress = this.add.graphics()
    this.load.on('progress', this.onDrawProgressBar, this)
    this.load.on('complete', () => { progressBar.destroy() })

    this.load.image('someFon', someFon)
    this.load.image('someFon2', someFon2)
  }

  private onDrawProgressBar (value: number) {
    if (!this._progress) return

    this._progress.clear()
    this._progress.fillStyle(0xffffdd, 1)
    const gameSize = this.scale.gameSize
    this._progress.fillRect(0, (gameSize.height - 22), gameSize.width * value, 20)
  }
}
