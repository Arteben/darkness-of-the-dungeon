// fonts
import '@/styles/index.css'

import { DungeonDarkness } from '@/classes/dungeon-darkness'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'
import { EventBus } from '@/classes/event-bus'
import { GameHashes } from '@/classes/game-hashes'
import { GameLocSettings } from '@/classes/game-loc-settings'

EventBus.Create()
const hashParams = new GameHashes().getLocalStateForStart()
const locSettings = new GameLocSettings().getLocSettings()

const gameState = new GameState(hashParams, locSettings)
const locals = new Translates(gameState)
const dungeonDarknessGame = new DungeonDarkness(gameState, locals)

const gameApp = document.createElement('game-app')
const body = document.querySelector('body')

// append gameApp elements to html
body?.appendChild(gameApp)

// search and get convas for phaser
gameApp.canvasParent.then((parent: HTMLElement | null) => {
  if (!parent) return
  gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
    if (!element) return
    dungeonDarknessGame?.createPhaserGame(element, parent, gameApp)
    dungeonDarknessGame?.onWindowResize()
  }, () => { })
}, () => { })
