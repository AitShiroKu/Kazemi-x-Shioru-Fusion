import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildStickerDelete;
export const once = false;

export async function execute(sticker: any) {
  const client = sticker.client;
  const guild = sticker.guild;

  const stickerDeleteEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.stickerDelete.sticker_notification'))
    .setDescription(
      client.i18n
        .t('events.stickerDelete.sticker_delete')
        .replace('%s', sticker.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, stickerDeleteEmbed);

  client.logger.debug(`StickerDelete event completed for ${sticker.name}`);
}
