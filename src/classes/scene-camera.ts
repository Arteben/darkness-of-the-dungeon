import { MainEngine } from '@/classes/main-engine'

export class SceneCamera {
  cameraControls!: Phaser.Cameras.Controls.FixedKeyControl
  main: Phaser.Cameras.Scene2D.Camera

  constructor(engine: MainEngine) {

    this.main = engine.cameras.main
    this.main.setScroll(0, 0)
    const arrowCameraControls = engine.input.keyboard?.createCursorKeys()
    if (!arrowCameraControls) return

    const controlConfig = {
      camera: engine.cameras.main,
      left: arrowCameraControls.left,
      right: arrowCameraControls.right,
      up: arrowCameraControls.up,
      down: arrowCameraControls.down,
      speed: 1
    }
    this.cameraControls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig)
  }
}
