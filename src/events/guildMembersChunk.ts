import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../handlers/types.js';

export const name = Events.GuildMembersChunk;
export const once = false;

export async function execute(client: any, _members: any, guild: any, _chunk: any) {

  const guildMembersChunkEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t('events.guildMembersChunk.guild_notification'),
    )
    .setDescription(
      client.i18n
        .t('events.guildMembersChunk.guild_members_chunk')
        .replace('%s', guild.name),
    )
    .setImage(guild.bannerURL())
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, Events.GuildMembersChunk, guildMembersChunkEmbed);

  client.logger.debug(`GuildMembersChunk event completed for ${guild.name}`);
}
