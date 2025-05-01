import {
  ProgressBarNullData,
  IScreenSizes,
  DudeProgresBarNullValues,
} from '@/types/main-types'

import {
  ProgressBarTypes,
  SceneLevelZIndexes,
} from '@/types/enums'

import { MainEngine } from '@/classes/main-engine'

export class DudeProgressBar {

  private _drawData: ProgressBarNullData = null
  public set drawData(data: ProgressBarNullData) {
    this._drawData = data
    this.redrawBar()
  }
  public get drawData(): ProgressBarNullData {
    return this._drawData
  }

  _el: Phaser.GameObjects.Graphics
  _outRectFill: number = 0x070707
  _innerRectFill: number = 0x00ff00
  _outRectBorder: number = 0x9da5be

  _sizes: IScreenSizes = { x: 70, y: 7 }

  constructor(engine: MainEngine) {
    const ss = this._sizes
    const halfX = ss.x / 2
    const halfY = ss.y / 2
    this._el = engine.add.graphics()
    this._el.fillStyle(this._outRectFill, 1)
    this._el.lineStyle(1, this._outRectBorder, 1)
    this._el.fillCircle(-halfX, 0, halfY)
    this._el.strokeCircle(-halfX, 0, halfY)
    this._el.fillCircle(halfX, 0, halfY)
    this._el.strokeCircle(halfX, 0, halfY)
    this._el.fillRect(-halfX, -halfY, ss.x, ss.y)
    this._el.beginPath()
    this._el.moveTo(-halfX, -halfY)
    this._el.lineTo(halfX, -halfY)
    this._el.moveTo(-halfX, halfY)
    this._el.lineTo(halfX, halfY)

    this._el.closePath()
    this._el.strokePath()

    this._el.setDepth(SceneLevelZIndexes.progressBarLevel)
  }

  redrawBar() {
    if (this._drawData == null) {
      this._el.visible = false
      return
    }

    const ss = this._sizes

    const getLinesForPercentsUsualBar = (value: number, color: number) => {
      const length = value * ss.x / 100
      this._el.lineStyle(ss.y / 3, color, 1)
      this._el.beginPath()
      this._el.moveTo(-ss.x / 2, 0)
      this._el.lineTo(-ss.x / 2 + length, 0)
      this._el.strokePath()
      this._el.beginPath()
    }

    this._el.visible = true

    const progress = DudeProgressBar.GetPercentFromNum(this._drawData.progress)

    if (this._drawData.type == ProgressBarTypes.usual) {
      getLinesForPercentsUsualBar(100, this._outRectFill)
      getLinesForPercentsUsualBar(progress, this._innerRectFill)
    } else if (this._drawData.type == ProgressBarTypes.swordSwing) {
      // there is place for drawing fight bar here
      getLinesForPercentsUsualBar(100, this._outRectFill)
      getLinesForPercentsUsualBar(progress, 0xff0000)
    }

    this._el.setPosition(this._drawData.position.w, this._drawData.position.h)
  }

  static GetPercentFromNum(num: number) {
    let progress = num
    if (progress < 0) {
      progress = 0
    } else if (progress > 100) {
      progress = 100
    }
    return progress
  }

  static GetUsualTypeBar(value: number): DudeProgresBarNullValues {
    return {
      progress: DudeProgressBar.GetPercentFromNum(value),
      type: ProgressBarTypes.usual
    }
  }

  static GetFightTypeBar(value: number): DudeProgresBarNullValues {
    return {
      progress: DudeProgressBar.GetPercentFromNum(value),
      type: ProgressBarTypes.swordSwing
    }
  }
}
