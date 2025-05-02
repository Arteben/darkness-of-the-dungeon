
import {
  EnvStaticElements,
  PocketItems,
} from '@/types/enums'

import {
  IEnvElementTypes
} from '@/types/main-types'

import { MapStaticElement } from '@/classes/map-static-element'

const boxes = new MapStaticElement(
  168,
  () => { console.log('you search in box!')},
)

export const envStaticElementTypes: IEnvElementTypes = {
  [EnvStaticElements.box]: boxes,
  [EnvStaticElements.bigBox]: boxes,
  [EnvStaticElements.barrels]: boxes,
  [EnvStaticElements.bigBarrel]: boxes,
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
