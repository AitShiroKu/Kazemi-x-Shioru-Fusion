import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../handlers/types.js';

export const name = Events.StageInstanceCreate;
export const once = false;

export async function execute(client: any, stageInstance: any) {

  const guild = stageInstance.guild;

  const stageInstanceCreateEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t('events.stageInstanceCreate.stage_notification'),
    )
    .setDescription(
      client.i18n
        .t('events.stageInstanceCreate.stage_instance_create')
        .replace('%s', stageInstance.id),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, stageInstanceCreateEmbed);

  client.logger.debug(`StageInstanceCreate event completed for ${stageInstance.id}`);
}
