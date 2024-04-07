import '@/ui-elements/mine-darkness-root'
import { InitGame } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'
import { GameHashes } from '@/classes/game-hashes'

EventBus.Create()
const hashParams = new GameHashes().getLocalState()
InitGame('mine-darkness-root', hashParams)
