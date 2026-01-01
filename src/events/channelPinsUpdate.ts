import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ChannelPinsUpdate;
export const once = false;

export async function execute(channel: any, time: any) {
  const client = channel.client;
  const guild = channel.guild;

  const channelPinsUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.channelPinsUpdate.channel_notification'))
    .setDescription(
      client.i18n
        .t('events.channelPinsUpdate.member_pins_in_channel')
        .replace('%s1', channel.id)
        .replace('%s2', time),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, channelPinsUpdateEmbed);

  client.logger.debug(`ChannelPinsUpdate event completed for ${channel.id}`);
}
