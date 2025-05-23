import { Scene, GameObjects, Types, Physics } from 'phaser'

import {
  IResolution,
  mainKeys,
  IJsonMap,
  IParamsForInitEngine,
  ILoadedTileSets,
  IUserModalAddOptions,
} from '@/types/main-types'

import { UserModalAddOptionsEnum } from '@/types/enums'

// assets
import tilesRaw from '@assets/castle-tiles.png'
import tilesWallsRaw from '@assets/castle-tileset-walls.png'
import tipIcons from '@assets/tip-icons.png'
import bricksRaw from '@assets/bricks.png'
import charRaw from '@assets/char.png'
import itemIcons from '@assets/items-Icons.png'
import additinalIcons from '@assets/add-tip-icons.png'
import warriorImg from '@assets/warrior-modal.png'
//
import { MapSceneLevels } from '@/classes/map-scene-levels'
import { Dude } from '@/classes/dude'
import { SceneCamera } from '@/classes/scene-camera'
import { IconTips } from '@/classes/icon-tips'
import { DroppedItemsSystem as DroppedItems } from '@/classes/dropped-items-system'
import { EnvStaticMapElements } from '@/classes/env-static-map-elements'
//
import { default as JsonMapList } from '@/assets/maps/map-list.json'
import { PocketSlotsSystem } from '@/classes/pocket-slots-system'
import { NotificationsModalsSystem } from '@/classes/notifications-modals-system'
import { ScopeEndGame } from '@/classes/scope-and-end-game'

const mapList: IJsonMap[] = JsonMapList

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _dude!: Dude
  _keys!: mainKeys

  _selectedMap: string = ''
  //@ts-ignore
  _slotSystem: PocketSlotsSystem
  //@ts-ignore
  _modalsSystem: NotificationsModalsSystem
  //@ts-ignore
  _scopeEndGame: ScopeEndGame


  constructor() {
    super()
  }

  init(initParams: IParamsForInitEngine) {
    this._selectedMap = initParams.nameMap
    this._slotSystem = initParams.slotsSystem
    this._modalsSystem = initParams.modalsSystem
    this._scopeEndGame = initParams.scopeEndGame
  }

  create() {
    // console.log(this.textures.list)

    this.setMainKyes()

    const tls: ILoadedTileSets = {
      walls: 'wallTileSet',
      env: 'tileSet',
      fon: 'backgroundTileSet'
    }

    const mapLevels = new MapSceneLevels(this, this._selectedMap, tls)
    if (!(mapLevels && mapLevels.groundLayer)) return

    this.physics.world.setBounds(0, 0, mapLevels.mapWidth, mapLevels.mapHeight)
    const sceneCamera = new SceneCamera(this, mapLevels.mapWidth, mapLevels.mapHeight)

    // this._tips['stairsTip'] = new IconTip('tipIcons', 39, this, sceneCamera)
    const tips = new IconTips('tipIcons', 'additinalTipIcons', this, sceneCamera)

    // +++++ dropped Items +++++++++
    const droppedItems = new DroppedItems(this, mapLevels, 'itemIcons')

    const listOfStaticElements =
      new EnvStaticMapElements(mapLevels.envLayer as Phaser.Tilemaps.TilemapLayer).elementsList

    this._dude = new Dude(
      this, mapLevels, sceneCamera, tips, droppedItems,
      this._slotSystem, this._modalsSystem,
      'dudeFrameSet',
      { width: 32, height: 45 } as IResolution,
      listOfStaticElements,
    )

    if (this._scopeEndGame.isShowIntro()) {
      this._modalsSystem.showModal({
        text: this._modalsSystem.loc('gameIntroModalText'),
        callback: (options?: IUserModalAddOptions[]) => {
          this._scopeEndGame.startGame()

          if (!options) return
          options.forEach((element: IUserModalAddOptions) => {
            if (UserModalAddOptionsEnum[element.prop] == 'shownOnStart') {
              this._scopeEndGame.setIsShowIntro(element.value)
            }
          })
        },
        image: warriorImg,
        options: [{
          value: true,
          prop: UserModalAddOptionsEnum.shownOnStart,
        }],
      })
    }
  }

  update(time: number): void {
    if (this._keys) {
      this._dude.updateKyes(time, this._keys)
    }
    this._dude.updateClimbingMovements()
    this._dude.mainUpdate(time)
  }

  preload() {
    // progress bar
    this._progress = this.add.graphics()
    this.load.on('progress', this.onDrawProgressBar, this)
    this.load.on('complete', () => { this._progress.destroy() })
    //

    this.load.image('tileSet', tilesRaw)
    this.load.image('wallTileSet', tilesWallsRaw)
    this.load.image('backgroundTileSet', bricksRaw)
    // load for maps
    // '/src/assets/maps/map3.txt'
    mapList.forEach((el: IJsonMap) => {
      this.load.text(el.name, `/src/assets/${el.file}`)
    })

    this.load.spritesheet('dudeFrameSet', charRaw, { frameWidth: 56, frameHeight: 56 })

    this.load.spritesheet('tipIcons', tipIcons, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('itemIcons', itemIcons, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('additinalTipIcons', additinalIcons, { frameWidth: 32, frameHeight: 32 })
  }

  onDrawProgressBar(value: number) {
    this._progress.clear()
    this._progress.fillStyle(0xffffdd, 1)
    const gameSize = this.scale.gameSize
    this._progress.fillRect(0, (gameSize.height - 22), gameSize.width * value, 20)
  }

  setMainKyes() {
    this._keys = this.input?.keyboard?.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      ctrl: Phaser.Input.Keyboard.KeyCodes.CTRL,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
    }) as mainKeys
  }
}
