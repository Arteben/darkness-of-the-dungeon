import { InitGame } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'
import { GameHashes } from '@/classes/game-hashes'
import { GameLocSettings } from '@/classes/game-loc-settings'


EventBus.Create()
const hashParams = new GameHashes().getLocalState()
const locSettings = new GameLocSettings().getLocSettings()
InitGame(hashParams, locSettings)
