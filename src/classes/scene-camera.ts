import { Scene, GameObjects, Types, Physics } from 'phaser'

import { MainEngine } from '@/classes/main-engine'

export class SceneCamera {
  private _main: Phaser.Cameras.Scene2D.Camera
  _defaultZoom = 1
  _zoomLevel: number = this._defaultZoom
  _maxZoomLevel = 0.2

  // isZooming
  private _isZooming: boolean = false
  public set isZooming(value: boolean) {
    this.setIsZooming(value)
  }
  public get isZooming(): boolean {
    return this._isZooming
  }
  //-isZooming-//

  constructor(engine: MainEngine, width: number, height: number) {
    this._main = engine.cameras.main
    this._main.setBounds(0, 0, width, height)
    this.setStandartOffset()
    this.setDefaultZoom()
  }

  startFollow(sprite: Types.Physics.Arcade.SpriteWithDynamicBody) {
    this._main.startFollow(sprite, true, 1, 0.05)
  }

  setStandartOffset() {
    this.setFollowOffser(0, 100)
  }

  setDownMoveOffset() {
    this.setFollowOffser(0, -100)
  }

  setFollowOffser(x: null | number, y: null | number) {
    if (x !== null) {
      this._main.followOffset.x = x
    }

    if (y !== null) {
      this._main.followOffset.y = y
    }
  }

  setDefaultZoom() {
    this._zoomLevel = this._defaultZoom
    this._main.setZoom(this._defaultZoom)
  }

  private increaseZoom(value: number) {
    const newValue = this._zoomLevel - value
    if (newValue >= this._maxZoomLevel) {
      this._zoomLevel = newValue
      this._main.setZoom(this._zoomLevel)
    }
  }

  private setIsZooming(value: boolean) {
    if (value) {
      if (!this._isZooming) {
        this._isZooming = true
        this._main.useBounds = false
      }
      this.increaseZoom(0.04)
    } else if (this._isZooming) {
      this._isZooming = false
      this._main.useBounds = true
      this.setDefaultZoom()
    }
  }
}
