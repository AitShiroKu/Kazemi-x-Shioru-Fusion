import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildBanAdd;
export const once = false;

export async function execute(client: any, ban: any) {

  const guild = ban.guild;

  const guildBanAddEmbed = new EmbedBuilder()
    .setTitle(ban.client.i18n.t('events.guildBanAdd.guild_notification'))
    .setDescription(
      ban.client.i18n.t('events.guildBanAdd.member_ban')
        .replace('%s1', ban.user.tag)
        .replace('%s2', ban.reason),
    )
    .setTimestamp()
    .setColor(Colors.Yellow)
    .setThumbnail(ban.user.displayAvatarURL())
    .setAuthor({
      iconURL:
        'https://emoji-media-us.s3.dualstack.us-west-1.amazonaws.com/120/microsoft/209/video-game_1f3ae.png',
      name: ban.client.i18n.t('events.guildBanAdd.ban'),
    });

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, Events.GuildBanAdd, guildBanAddEmbed);

  client.logger.debug(`GuildBanAdd event completed for ${ban.user.tag}`);
}
