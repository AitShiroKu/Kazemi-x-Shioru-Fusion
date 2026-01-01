import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.InviteDelete;
export const once = false;

export async function execute(client: any, invite: any) {

  const guild = invite.guild;

  const inviteDeleteEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.inviteDelete.invite_notification'))
    .setDescription(
      new Date().getTime() !== new Date(invite.expiresAt).getTime()
        ? client.i18n
            .t('events.inviteDelete.invite_code_deleted')
            .replace('%s', invite.code)
        : client.i18n
            .t('events.inviteDelete.invite_code_expires')
            .replace('%s', invite.code),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, inviteDeleteEmbed);

  client.logger.debug(`InviteDelete event completed for ${invite.code}`);
}
