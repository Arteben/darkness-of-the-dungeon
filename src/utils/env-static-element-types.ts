
import {
  EnvStaticElements,
  PocketItems,
} from '@/types/enums'
import { IEnvElementTypes } from '@/types/main-types'
import { MapStaticElement } from '@/classes/map-static-element'

export const envStaticElementTypes: IEnvElementTypes = {
  [EnvStaticElements.box]: new MapStaticElement(
    168,
  ),
  [EnvStaticElements.chest]: new MapStaticElement(
    168,
  ),
  [EnvStaticElements.door]: new MapStaticElement(
    15,
    PocketItems.key,
  ),
  [EnvStaticElements.torch]: new MapStaticElement(
    170,
  ),
}
