import { setMineDarknessGame, MineDarkness } from '@/classes/mine-darkness'
import { GameState } from '@/classes/game-state'
import { Translates } from '@/classes/translates'
import { EventBus } from '@/classes/event-bus'
import { GameHashes } from '@/classes/game-hashes'
import { GameLocSettings } from '@/classes/game-loc-settings'

EventBus.Create()
const hashParams = new GameHashes().getLocalState()
const locSettings = new GameLocSettings().getLocSettings()

const gameState = new GameState(hashParams, locSettings)
const locals = new Translates(gameState)

initGame: {
  const gameApp = document.createElement('game-app')
  const body = document.querySelector('body')
  if (gameApp == null || body == null) {
    console.error('BODY OR GameApp equals null')
    break initGame
  }

  const mineDarknessGame = new MineDarkness(gameState, locals, gameApp)
  setMineDarknessGame(mineDarknessGame)

  // append gameApp elements to html
  body.appendChild(gameApp)

  // search and get convas for phaser
  gameApp.canvasParent.then((parent: HTMLElement | null) => {
    if (!parent) return
    gameApp.phaserCanvas.then((element: HTMLCanvasElement | null) => {
      if (!element) return
      mineDarknessGame?.createPhaserGame(element, parent)
      mineDarknessGame?.onWindowResize()
    }, () => { })
  }, () => { })
}
