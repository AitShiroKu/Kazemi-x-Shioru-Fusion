import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../services/handlers/types.js';

export const name = Events.GuildUnavailable;
export const once = false;

export async function execute(client: any, guild: any) {

  const guildUnavailableEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.guildUnavailable.guild_notification'))
    .setDescription(
      client.i18n.t('events.guildUnavailable.guild_unavailable'),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, guildUnavailableEmbed);

  client.logger.debug(`GuildUnavailable event completed for ${guild.name}`);
}
