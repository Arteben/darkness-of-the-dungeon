import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MainEngine } from '@/classes/main-engine'

export class SceneCamera {
  main: Phaser.Cameras.Scene2D.Camera
  _defaultZoom = 1
  _zoomLevel: number
  _maxZoomLevel = 0.2

  // isZooming
  _isZooming: boolean = false
  public set isZooming(value: boolean) {
    if (value) {
      if (!this._isZooming) {
        this._isZooming = true
        this.main.useBounds = false
      }
      this.increaseZoom(0.04)
    } else if (this._isZooming) {
      this._isZooming = false
      this.main.useBounds = true
      this.setDefaultZoom()
    }
  }
  public get isZooming(): boolean {
    return this._isZooming
  }
  //-isZooming-//

  constructor(engine: MainEngine) {

    this.main = engine.cameras.main
    this._zoomLevel = this._defaultZoom
  }

  startFollow(sprite: Types.Physics.Arcade.SpriteWithDynamicBody) {
    this.main.startFollow(sprite, true, 1, 0.05)
  }

  setFollowOffser(x: null | number, y: null | number) {
    if (x !== null) {
      this.main.followOffset.x = x
    }

    if (y !== null) {
      this.main.followOffset.y = y
    }
  }

  setZoom(zoomLevel: number) {
    this.main.setZoom(zoomLevel)
  }

  setDefaultZoom() {
    this._zoomLevel = this._defaultZoom
    this.setZoom(this._defaultZoom)
  }

  increaseZoom(value: number) {
    const newValue = this._zoomLevel - value
    if (newValue >= this._maxZoomLevel) {
      this._zoomLevel = newValue
      this.setZoom(this._zoomLevel)
    }
  }
}
