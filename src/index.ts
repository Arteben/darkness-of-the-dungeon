import '@/ui-elements/mine-darkness-root'
import { InitGame } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'

EventBus.Create()

InitGame('mine-darkness-root')
