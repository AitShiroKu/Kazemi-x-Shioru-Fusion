import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.InviteCreate;
export const once = false;

export async function execute(invite: any) {
  const client = invite.client;
  const guild = invite.guild;

  const inviteCreateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.inviteCreate.invite_notification'))
    .setDescription(
      client.i18n
        .t('events.inviteCreate.invite_create')
        .replace('%s1', invite.url)
        .replace('%s2', invite.expiresAt)
        .replace('%s3', invite.maxUses)
        .replace('%s4', invite.code),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, inviteCreateEmbed);

  client.logger.debug(`InviteCreate event completed for ${invite.code}`);
}
