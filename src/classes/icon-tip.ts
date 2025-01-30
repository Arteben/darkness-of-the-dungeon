import { Scene, GameObjects, Types, Physics } from 'phaser'
import { INumberCoords, IScreenSizes } from '@/types/main-types'

import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'
// import { MapSceneLevels } from '@/classes/map-scene-levels'
// import { Dude } from '@/classes/dude'

export class IconTip {

  _sprite: Phaser.GameObjects.Sprite
  _camera: SceneCamera

  // visible
  private _isVisible = false
  public set isVisible(value: boolean) {
    this._isVisible = value
    this._sprite.setActive(value)
    this._sprite.setVisible(value)
  }
  public get isVisible(): boolean {
    return this._isVisible
  }
  //

  constructor(
    tileSet: string, frame: number, engine: MainEngine, camera: SceneCamera) {
    this._sprite = engine.add.sprite(0, 0, tileSet, frame)
    this._sprite.visible = false
    this._camera = camera
  }

  update(t: number): void {
    if (this.isVisible) {
      const offset = 0.004 * (t % 1000) - 2
      this._sprite.y = this._sprite.y - offset
    }
  }

  setIcon(isShow: boolean, coords: INumberCoords | null) {
    this.isVisible = isShow
    if (!isShow)
      return

    if (!coords)
      return

    const cameraOffset = this._camera.getScrollOffsets()
    let verticalOffset = -40
    let horOffset = 50

    if (cameraOffset.y === 0) {
      verticalOffset = -10
    }

    if (cameraOffset.x !== 0) {
      horOffset = -(horOffset)
    }

    this._sprite.x = coords.w + horOffset
    this._sprite.y = coords.h + verticalOffset
  }
}
