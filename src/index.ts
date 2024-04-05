import '@/app-element'
import { InitGame } from '@/classes/mine-darkness'
import { EventBus } from '@/classes/event-bus'

EventBus.Create()

InitGame('app-element')
