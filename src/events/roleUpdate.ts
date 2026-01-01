import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildRoleUpdate;
export const once = false;

export async function execute(oldRole: any, newRole: any) {
  const client = newRole.client;
  const guild = newRole.guild;

  const roleUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.roleUpdate.role_notification'))
    .setDescription(
      client.i18n
        .t('events.roleUpdate.role_update')
        .replace('%s1', oldRole.name)
        .replace('%s2', newRole.id),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, roleUpdateEmbed);

  client.logger.debug(`RoleUpdate event completed for ${newRole.name}`);
}
