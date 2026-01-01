import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildBanRemove;
export const once = false;

export async function execute(client: any, ban: any) {

  const guild = ban.guild;

  const guildBanRemoveEmbed = new EmbedBuilder()
    .setTitle(ban.client.i18n.t('events.guildBanRemove.guild_notification'))
    .setDescription(
      ban.client.i18n
        .t('events.guildBanRemove.member_ban_remove')
        .replace('%s1', ban.user.id)
        .replace('%s2', ban.reason),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, Events.GuildBanRemove, guildBanRemoveEmbed);

  client.logger.debug(`GuildBanRemove event completed for ${ban.user.tag}`);
}
