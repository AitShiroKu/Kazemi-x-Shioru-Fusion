import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../services/handlers/types.js';

export const name = Events.ThreadListSync;
export const once = false;

export async function execute(client: any, threads: any, guild: any) {

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
