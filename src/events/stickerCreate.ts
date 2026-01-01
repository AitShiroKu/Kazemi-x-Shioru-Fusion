import {
  Events,
  EmbedBuilder,
  Colors,
  StickerFormatType,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildStickerCreate;
export const once = false;

export async function execute(sticker: any) {
  const client = sticker.client;
  const guild = sticker.guild;

  const stickerCreateEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t('events.stickerCreate.sticker_notification'),
    )
    .setDescription(
      client.i18n
        .t('events.stickerCreate.sticker_create')
        .replace('%s', sticker.name),
    )
    .setThumbnail(
      sticker.format !== StickerFormatType.Lottie ? sticker.url : '',
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, stickerCreateEmbed);

  client.logger.debug(`StickerCreate event completed for ${sticker.name}`);
}
