
import { EnvStaticElements } from '@/types/enums'
import { IEnvElementTypes } from '@/types/main-types'
import { MapStaticElement } from '@/classes/map-static-element'
import { Dude } from '@/classes/dude'

export const pocketItemTypes: IEnvElementTypes = {
  [EnvStaticElements.box]: new MapStaticElement()
}
