import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../services/handlers/types.js';

export const name = Events.ThreadMembersUpdate;
export const once = false;

export async function execute(client: any, addedMembers: any,
  removedMembers: any,
  thread: any,
) {

  const guild = thread.guild;

  // Initialize guild data
  await (client as any).initializeData(guild);

  if (addedMembers.size) {
    const threadMembersUpdateAddedEmbed = new EmbedBuilder()
      .setTitle(client.i18n.t('events.threadMembersUpdate.thread_notification'))
      .setDescription(
        client.i18n.t('events.threadMembersUpdate.added_thread_members', {
          thread_id: thread.id,
          count: addedMembers.size,
        }),
      )
      .setImage(guild.bannerURL())
      .setTimestamp()
      .setColor(Colors.Blue);

    await (client as any).submitNotification(
      guild,
      name,
      threadMembersUpdateAddedEmbed,
    );
  }

  if (removedMembers.size) {
    const threadMembersUpdateRemovedEmbed = new EmbedBuilder()
      .setTitle(client.i18n.t('events.threadMembersUpdate.thread_notification'))
      .setDescription(
        client.i18n.t('events.threadMembersUpdate.removed_thread_members', {
          thread_id: thread.id,
          count: removedMembers.size,
        }),
      )
      .setImage(guild.bannerURL())
      .setTimestamp()
      .setColor(Colors.Blue);

    await (client as any).submitNotification(
      guild,
      name,
      threadMembersUpdateRemovedEmbed,
    );
  }

  client.logger.debug(
    `ThreadMembersUpdate event completed for ${thread.id} (+${addedMembers.size}, -${removedMembers.size})`,
  );
}
