import { InitGame } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'
import { GameHashes } from '@/classes/game-hashes'
import { GameLocSettings } from '@/classes/game-loc-settings'

import { LocSettingsList } from '@/types/enums'

EventBus.Create()
const hashParams = new GameHashes().getLocalState()

const locSettings = new GameLocSettings()
locSettings.setLocSettings(LocSettingsList.isSound, false)
locSettings.setLocSettings(LocSettingsList.selectedMap, 'someMap')

const getSets = locSettings.getLocSettings()
console.log('new sets', getSets, locSettings.defaultLocSettings)

InitGame(hashParams)
