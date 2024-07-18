import { InitGame } from '@/classes/mine-darkness'
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

InitGame(gameState, locals)
