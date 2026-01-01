import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.StageInstanceDelete;
export const once = false;

export async function execute(client: any, stageInstance: any) {

  const guild = stageInstance.guild;

  const stageInstanceDeleteEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t('events.stageInstanceDelete.stage_notification'),
    )
    .setDescription(
      client.i18n
        .t('events.stageInstanceDelete.stage_instance_delete')
        .replace('%s', stageInstance.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, stageInstanceDeleteEmbed);

  client.logger.debug(`StageInstanceDelete event completed for ${stageInstance.name}`);
}
