import {
  Events,
  EmbedBuilder,
  Colors,
  StickerFormatType,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildStickerUpdate;
export const once = false;

export async function execute(oldSticker: any, newSticker: any) {
  const client = newSticker.client;
  const guild = newSticker.guild;

  const stickerUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.stickerUpdate.sticker_notification'))
    .setDescription(
      client.i18n
        .t('events.stickerUpdate.sticker_update')
        .replace('%s1', oldSticker.name)
        .replace('%s2', newSticker.id),
    )
    .setThumbnail(
      newSticker.format !== StickerFormatType.Lottie ? newSticker.url : '',
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, stickerUpdateEmbed);

  client.logger.debug(
    `StickerUpdate event completed for ${oldSticker.name} -> ${newSticker.name}`,
  );
}
