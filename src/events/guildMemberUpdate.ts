import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildMemberUpdate;
export const once = false;

export async function execute(oldMember: any, newMember: any) {
  const client = newMember.client;
  const guild = newMember.guild;

  const guildMemberUpdateEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t('events.guildMemberUpdate.guild_notification'),
    )
    .setDescription(
      client.i18n.t('events.guildMemberUpdate.guild_member_updated', {
        old_member:
          oldMember.user.tag ||
          client.i18n.t('events.guildMemberUpdate.unknown'),
        new_member: newMember.user.tag,
      }),
    )
    .setImage(guild.bannerURL())
    .setTimestamp()
    .setColor(Colors.Blue);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, guildMemberUpdateEmbed);

  client.logger.debug(`GuildMemberUpdate event completed for ${newMember.user.tag}`);
}
