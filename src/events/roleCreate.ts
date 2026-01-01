import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildRoleCreate;
export const once = false;

export async function execute(client: any, role: any) {

  const guild = role.guild;

  const roleCreateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.roleCreate.role_notification'))
    .setDescription(
      client.i18n
        .t('events.roleCreate.role_create')
        .replace('%s', role.id),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, roleCreateEmbed);

  client.logger.debug(`RoleCreate event completed for ${role.id}`);
}
