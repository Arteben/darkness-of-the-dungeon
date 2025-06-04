import {
  PocketItemsEnum,
  UserNotificationTypes,
  EnvStaticElements,
  SoundLevels,
  DudeActionSounds,
} from '@/types/enums'

import {
  IPocketItemTypes,
  DroppedItemsList,
} from '@/types/main-types'

import { PocketItem } from '@/classes/pocket-item'
import { Dude } from '@/classes/dude'

const translatesDroppedItemKey = 'droppedItemAction'

const getNotesForNoIteractiveItems = (item: PocketItemsEnum, char: Dude) => {
  const translate = char.userModals.argsLoc(
    translatesDroppedItemKey + 'Item', ['droppedItem' + PocketItemsEnum[item]])

  return {
    type: UserNotificationTypes.error,
    text: translate,
  }
}

export const pocketItemTypes: IPocketItemTypes = {
  [PocketItemsEnum.apple]: new PocketItem(
    PocketItemsEnum.apple,
    { x: 15, y: 15 },
    () => { console.log('you used apple!') },
  ),
  [PocketItemsEnum.key]: new PocketItem(
    PocketItemsEnum.key,
    { x: 10, y: 10 },
    function (this: PocketItem, dude: Dude) {
      const envData = dude.envCollisionElementData
      if (envData && envData.isCorrectToolType(this.type)) {
        envData.use(dude)
      } else {
        dude.userModals.showNotification(getNotesForNoIteractiveItems(this.type, dude))
      }
    },
    false,
    0.8,
    DudeActionSounds.getKey,
  ),
  [PocketItemsEnum.hand]: new PocketItem(
    PocketItemsEnum.hand,
    { x: 20, y: 20 },
    function (this: PocketItem, dude: Dude) {
      const envData = dude.envCollisionElementData
      const pocketItemData = dude.pocketItemCollisionData
      if (envData && envData.isCorrectToolType(this.type)) {
        envData.use(dude)
      } else if (pocketItemData) {
        const pickupItemType = dude.dropItems.pickupItem(pocketItemData.coords)
        if (pickupItemType == null) return

        const callbackForPlaySound = (item: PocketItem) => {
          dude.sounds.playSingleSoundForLevel(SoundLevels[SoundLevels.dudeActionSounds], DudeActionSounds[item.pickupSound])
        }

        dude._slotSystem.addItem(pocketItemData.type, callbackForPlaySound)

        dude.pocketItemCollisionData = dude.dropItems.getItemDataForActiveItem(pocketItemData.coords)
      } else if (envData && envData.tileIndex == EnvStaticElements.door) {
        dude.userModals.showNotification({
          type: UserNotificationTypes.error,
          text: dude.userModals.loc('droppedItemActionWrongDoor')
        })
      } else {
        dude.userModals.showNotification({
          type: UserNotificationTypes.error,
          text: dude.userModals.loc(
            translatesDroppedItemKey + PocketItemsEnum[this.type]
          ),
        })
      }
    },
    false,
    0,
    undefined,
    false,
  ),
  [PocketItemsEnum.rock]: new PocketItem(
    PocketItemsEnum.rock,
    { x: 15, y: 15 },
    function (this: PocketItem, dude: Dude) {
      dude.userModals.showNotification(getNotesForNoIteractiveItems(this.type, dude))
    },
  ),
  [PocketItemsEnum.smolBranch]: new PocketItem(
    PocketItemsEnum.smolBranch,
    { x: 10, y: 10 },
    function () { },
    true,
    0.75,
  ),
}

export const boxDroppedItems: DroppedItemsList = [
  pocketItemTypes[PocketItemsEnum.apple],
  pocketItemTypes[PocketItemsEnum.rock],
]
