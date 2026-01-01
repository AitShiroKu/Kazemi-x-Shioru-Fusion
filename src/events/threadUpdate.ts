import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ThreadUpdate;
export const once = false;

export async function execute(oldThread: any, newThread: any) {
  const client = newThread.client;
  const guild = newThread.guild;

  const threadUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.threadUpdate.thread_notification'))
    .setDescription(
      client.i18n
        .t('events.threadUpdate.thread_update')
        .replace('%s1', oldThread.name)
        .replace('%s2', newThread.id),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, threadUpdateEmbed);

  client.logger.debug(
    `ThreadUpdate event completed for ${oldThread.name} -> ${newThread.name}`,
  );
}
