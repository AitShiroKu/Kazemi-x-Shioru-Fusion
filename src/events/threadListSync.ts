import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ThreadListSync;
export const once = false;

export async function execute(threads: any, guild: any) {
  const client = guild.client;

  const threadListSyncEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.threadListSync.thread_notification'))
    .setDescription(
      client.i18n.t('events.threadListSync.thread_list_synced', {
        count: threads.size,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Blue);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, threadListSyncEmbed);

  client.logger.debug(
    `ThreadListSync event completed for ${threads.size} threads`,
  );
}
