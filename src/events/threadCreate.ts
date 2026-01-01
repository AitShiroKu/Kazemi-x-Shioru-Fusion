import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ThreadCreate;
export const once = false;

export async function execute(thread: any, _newlyCreated: any) {
  const client = thread.client;
  const guild = thread.guild;

  const threadCreateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.threadCreate.thread_notification'))
    .setDescription(
      client.i18n
        .t('events.threadCreate.thread_create')
        .replace('%s', thread.id),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, threadCreateEmbed);

  client.logger.debug(`ThreadCreate event completed for ${thread.id}`);
}
