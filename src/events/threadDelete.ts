import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../handlers/types.js';

export const name = Events.ThreadDelete;
export const once = false;

export async function execute(client: any, thread: any) {

  const guild = thread.guild;

  const threadDeleteEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.threadDelete.thread_notification'))
    .setDescription(
      client.i18n
        .t('events.threadDelete.thread_delete')
        .replace('%s', thread.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, threadDeleteEmbed);

  client.logger.debug(`ThreadDelete event completed for ${thread.name}`);
}
