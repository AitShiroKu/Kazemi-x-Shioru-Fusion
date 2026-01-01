import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.WebhooksUpdate;
export const once = false;

export async function execute(client: any, channel: any) {

  const guild = channel.guild;

  const webhookUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.webhookUpdate.webhook_notification'))
    .setDescription(
      client.i18n.t('events.webhookUpdate.webhook_update', {
        channel_id: channel.id,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, webhookUpdateEmbed);

  client.logger.debug(`WebhooksUpdate event completed for ${channel.id}`);
}
