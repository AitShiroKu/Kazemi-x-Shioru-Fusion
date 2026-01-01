import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildEmojiUpdate;
export const once = false;

export async function execute(oldEmoji: any, newEmoji: any) {
  const client = newEmoji.client;
  const guild = newEmoji.guild;

  const emojiUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.emojiUpdate.emoji_notification'))
    .setDescription(
      client.i18n
        .t('events.emojiUpdate.member_update_emoji')
        .replace('%s1', oldEmoji.name)
        .replace('%s2', newEmoji.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, emojiUpdateEmbed);

  client.logger.debug(`EmojiUpdate event completed: ${oldEmoji.name} -> ${newEmoji.name}`);
}
