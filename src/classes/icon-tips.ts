import { Scene, GameObjects, Types, Physics } from 'phaser'
import { INumberCoords, ISpriteNumsForCombinedTip, NumberNull } from '@/types/main-types'

import { MainEngine } from '@/classes/main-engine'
import { SceneCamera } from '@/classes/scene-camera'

export class IconTips {

  _engineFac: GameObjects.GameObjectFactory
  _activeTip: GameObjects.Container
  _camera: SceneCamera
  _tileSet: string
  _addIconsSet: string
  _staticTipY: number = 0

  // visible
  // @ts-ignore
  private _visibleTip: NumberNull
  public set visibleTip(value: NumberNull) {
    if (value != this._visibleTip) {
      if (value != null) {
        this._activeTip.setActive(true)
        this._activeTip.setVisible(true)
      } else {
        this._activeTip.setActive(false)
        this._activeTip.setVisible(false)
        this._activeTip.each((child: GameObjects.Sprite) => {
          child.destroy(true)
        })
      }
      this._visibleTip = value
    }
  }
  public get visibleTip(): NumberNull {
    return this._visibleTip
  }
  //

  constructor(
    tileSet: string, additinalTipIcons: string, engine: MainEngine, camera: SceneCamera) {
    this._tileSet = tileSet
    this._addIconsSet = additinalTipIcons
    this._engineFac = engine.add
    this._activeTip = this._engineFac.container()
    this._camera = camera
    this.visibleTip = null
  }

  update(t: number): void {
    if (this.visibleTip != null) {
      const offset = 0.004 * (t % 1000) - 2
      this._activeTip.y = this._staticTipY - offset
    }
  }

  setCoordsWithOffsets(coords: INumberCoords) {
    const cameraOffset = this._camera.getScrollOffsets()
    let verticalOffset = -40
    let horOffset = 50

    if (cameraOffset.y === 0) {
      verticalOffset = -10
    }

    if (cameraOffset.x !== 0) {
      horOffset = -(horOffset)
    }

    this._activeTip.x = coords.w + horOffset
    this._staticTipY = coords.h + verticalOffset
  }

  hideTip() {
    this.visibleTip = null
  }

  calcSpriteNumCombTip(sprites: ISpriteNumsForCombinedTip) {
    let sum = sprites.main
    if (sprites.rightBottom) {
      sum += 1000 + sprites.rightBottom
    }

    if (sprites.rightTop) {
      sum += 10000 + sprites.rightTop
    }

    return sum
  }

  isDrawTip(spriteNum: number, comIconSprites?: ISpriteNumsForCombinedTip) {
    if (comIconSprites) {
      return this.visibleTip == null || this.visibleTip != this.calcSpriteNumCombTip(comIconSprites)
    } else {
      return this.visibleTip == null || this.visibleTip != spriteNum
    }
  }

  showUsualTip(coords: INumberCoords, spriteNum: number) {
    if (!this.isDrawTip(spriteNum)) return
    this.visibleTip = spriteNum

    const sprite = this._engineFac.sprite(0, 0, this._tileSet, spriteNum)
    this._activeTip.add(sprite)
    this.setCoordsWithOffsets(coords)
  }

  showCombinedTip(coords: INumberCoords, sprites: ISpriteNumsForCombinedTip) {
    if (!this.isDrawTip(0, sprites)) return
    this.visibleTip = this.calcSpriteNumCombTip(sprites)

    const iconOffset: number = 10
    const scaleAddIcon: number = 0.8
    const horIndent: number = 2.1

    if (sprites.rightBottom != undefined) {
      const rbSprite = this._engineFac.sprite(iconOffset * horIndent, iconOffset, this._addIconsSet, sprites.rightBottom)
      rbSprite.setScale(scaleAddIcon, scaleAddIcon)
      this._activeTip.add(rbSprite)
    }

    if (sprites.rightTop != undefined) {
      const rtSprite = this._engineFac.sprite(iconOffset * horIndent, iconOffset * (-1.3) , this._addIconsSet, sprites.rightTop)
      rtSprite.setScale(scaleAddIcon, scaleAddIcon)
      this._activeTip.add(rtSprite)
    }

    const mainSprite = this._engineFac.sprite(0, 0, this._tileSet, sprites.main)
    this._activeTip.add(mainSprite)

    this.setCoordsWithOffsets(coords)
  }
}
