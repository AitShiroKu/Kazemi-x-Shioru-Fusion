import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';

export const name = Events.GuildEmojiDelete;
export const once = false;

export async function execute(client: any, emoji: any) {

  const guild = emoji.guild;

  const emojiDeleteEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.emojiDelete.emoji_notification'))
    .setDescription(
      client.i18n
        .t('events.emojiDelete.member_delete_emoji')
        .replace('%s', emoji.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, emojiDeleteEmbed);

  client.logger.debug(`EmojiDelete event completed for ${emoji.name}`);
}
