
import {
  EnvStaticElements,
  PocketItems,
} from '@/types/enums'

import {
  IEnvElementTypes
} from '@/types/main-types'

import { MapStaticElement } from '@/classes/map-static-element'

export const envStaticElementTypes: IEnvElementTypes = {
  [EnvStaticElements.box]: new MapStaticElement(
    168,
    () => { console.log('you search in box!')},
  ),
  [EnvStaticElements.chest]: new MapStaticElement(
    168,
    () => { console.log('you search in chest!')},
  ),
  [EnvStaticElements.door]: new MapStaticElement(
    15,
    () => { console.log('you open the door')},
    PocketItems.key,
  ),
  [EnvStaticElements.torch]: new MapStaticElement(
    170,
    () => { console.log('you create a fire!')},
  ),
}
