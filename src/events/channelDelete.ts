import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ChannelDelete;
export const once = false;

export async function execute(channel: any) {
  const client = channel.client;
  const guild = channel.guild;

  const channelDeleteEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.channelDelete.channel_notification'))
    .setDescription(
      client.i18n
        .t('events.channelDelete.member_delete_channel')
        .replace('%s', channel.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, channelDeleteEmbed);

  client.logger.debug(`ChannelDelete event completed for ${channel.name}`);
}
