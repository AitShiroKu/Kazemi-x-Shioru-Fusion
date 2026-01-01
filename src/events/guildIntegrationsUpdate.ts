import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildIntegrationsUpdate;
export const once = false;

export async function execute(guild: any) {
  const client = guild.client;

  const guildIntegrationsUpdateEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t(
        'events.guildIntegrationsUpdate.guild_notification',
      ),
    )
    .setDescription(
      client.i18n
        .t('events.guildIntegrationsUpdate.guild_integrations_update')
        .replace('%s', guild.name),
    )
    .setImage(guild.bannerURL())
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, Events.GuildIntegrationsUpdate, guildIntegrationsUpdateEmbed);

  client.logger.debug(`GuildIntegrationsUpdate event completed for ${guild.name}`);
}
