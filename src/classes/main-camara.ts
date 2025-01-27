import { MainEngine } from '@/classes/main-engine'
import { MapSceneLevels } from '@/classes/map-scene-levels'

export class MainCamera {
  cameraControls!: Phaser.Cameras.Controls.FixedKeyControl
  _camera: Phaser.Cameras.Scene2D.Camera

  constructor(engine: MainEngine, mapLevels: MapSceneLevels) {

    this._camera = engine.cameras.main
    this._camera.setScroll(0, 0)
    this._camera.setBounds(0, 0, mapLevels.mapWidth, mapLevels.mapHeight)

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
