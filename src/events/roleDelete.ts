import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildRoleDelete;
export const once = false;

export async function execute(role: any) {
  const client = role.client;
  const guild = role.guild;

  const roleDeleteEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.roleDelete.role_notification'))
    .setDescription(
      client.i18n
        .t('events.roleDelete.role_delete')
        .replace('%s', role.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, roleDeleteEmbed);

  client.logger.debug(`RoleDelete event completed for ${role.name}`);
}
