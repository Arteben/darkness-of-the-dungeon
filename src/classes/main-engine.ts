import { Scene, GameObjects } from 'phaser'

import {
  SoundLevels as LVSounds,
} from '@/types/enums'

import {
  IResolution,
  mainKeys,
  IJsonMap,
  ILoadedTileSets,
  IParamsForInitEngine,
} from '@/types/main-types'

//maps
import { default as JsonMapList } from '@/assets/maps/map-list.json'
// images
import tilesRaw from '@assets/castle-tiles.png'
import tilesWallsRaw from '@assets/castle-tileset-walls.png'
import tipIcons from '@assets/tip-icons.png'
import bricksRaw from '@assets/bricks.png'
import charRaw from '@assets/char.png'
import itemIcons from '@assets/items-Icons.png'
import additinalIcons from '@assets/add-tip-icons.png'
// sounds
import dudeMoveSoundsJSON from '@assets/sounds/dude-move-sounds.json.txt'
import dudeMoveSoundsOgg from '@assets/sounds/dude-move-sounds.ogg'
import dudeActionSoundsJSON from '@assets/sounds/dude-action-sounds.json.txt'
import dudeActionSoundsOgg from '@assets/sounds/dude-action-sounds.ogg'
//
import { MapSceneLevels } from '@/classes/map-scene-levels'
import { Dude } from '@/classes/dude'
import { SceneCamera } from '@/classes/scene-camera'
import { IconTips } from '@/classes/icon-tips'
import { DroppedItemsSystem as DroppedItems } from '@/classes/dropped-items-system'
import { EnvStaticMapElementTypes } from '@/classes/env-static-map-element-types'
import { PocketSlotsSystem } from '@/classes/pocket-slots-system'
import { NotificationsModalsSystem } from '@/classes/notifications-modals-system'
import { ScopeStartEndGame } from '@/classes/scope-start-end-game'
import { SoundSystem } from '@/classes/sound-system'

const mapList: IJsonMap[] = JsonMapList

export class MainEngine extends Scene {
  _progress!: GameObjects.Graphics
  _dude!: Dude
  _keys!: mainKeys

  _selectedMap: string = ''
  //@ts-ignore
  slotSystem: PocketSlotsSystem
  //@ts-ignore
  modalsSystem: NotificationsModalsSystem
  //@ts-ignore
  scopeEndGame: ScopeStartEndGame
  //@ts-ignore
  soundSystem: SoundSystem

  constructor() {
    super()
  }

  init(initParams: IParamsForInitEngine) {
    this._selectedMap = initParams.nameMap
    this.slotSystem = initParams.slotsSystem
    this.modalsSystem = initParams.modalsSystem
    this.scopeEndGame = initParams.scopeEndGame
    this.soundSystem = initParams.soundSystem
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
      new EnvStaticMapElementTypes(mapLevels.envLayer as Phaser.Tilemaps.TilemapLayer).elementsList

    this.soundSystem.addNewSfxLevel(
      LVSounds[LVSounds.dudeMoveSounds], LVSounds.dudeMoveSounds)
    this.soundSystem.addNewSfxLevel(
      LVSounds[LVSounds.dudeActionSounds], LVSounds.dudeActionSounds)

    this._dude = new Dude(
      this, mapLevels, sceneCamera, tips, droppedItems,
      'dudeFrameSet',
      { width: 32, height: 45 } as IResolution,
      listOfStaticElements,
    )
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
    // load for maps
    mapList.forEach((el: IJsonMap) => {
      this.load.text(el.name, `/src/assets/${el.file}`)
    })
    // load sprites
    this.load.image('tileSet', tilesRaw)
    this.load.image('wallTileSet', tilesWallsRaw)
    this.load.image('backgroundTileSet', bricksRaw)
    this.load.spritesheet('dudeFrameSet', charRaw, { frameWidth: 56, frameHeight: 56 })
    this.load.spritesheet('tipIcons', tipIcons, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('itemIcons', itemIcons, { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('additinalTipIcons', additinalIcons, { frameWidth: 32, frameHeight: 32 })
    // load sounds

    this.load.audioSprite(LVSounds[LVSounds.dudeMoveSounds], dudeMoveSoundsJSON, dudeMoveSoundsOgg)
    this.load.audioSprite(LVSounds[LVSounds.dudeActionSounds], dudeActionSoundsJSON, dudeActionSoundsOgg)
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
