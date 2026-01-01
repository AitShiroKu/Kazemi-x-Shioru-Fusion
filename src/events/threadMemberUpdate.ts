import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ThreadMemberUpdate;
export const once = false;

export async function execute(oldMember: any, newMember: any) {
  const client = newMember.client;
  const guild = newMember.guild;

  const threadMemberUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.threadMemberUpdate.thread_notification'))
    .setDescription(
      client.i18n.t('events.threadMemberUpdate.thread_member_updated', {
        old_member: oldMember.thread.name,
        new_member: newMember.thread.id,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Blue);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, threadMemberUpdateEmbed);

  client.logger.debug(
    `ThreadMemberUpdate event completed for ${oldMember.thread.name} -> ${newMember.thread.name}`,
  );
}
