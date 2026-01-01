import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildEmojiCreate;
export const once = false;

export async function execute(emoji: any) {
  const client = emoji.client;
  const guild = emoji.guild;

  const emojiCreateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.emojiCreate.emoji_notification'))
    .setDescription(
      client.i18n
        .t('events.emojiCreate.member_create_emoji')
        .replace('%s', emoji.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, emojiCreateEmbed);

  client.logger.debug(`EmojiCreate event completed for ${emoji.name}`);
}
