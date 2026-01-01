import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildSoundboardSoundDelete;
export const once = false;

export async function execute(client: any, soundboardSound: any) {

  const guild = soundboardSound.guild;

  const guildSoundboardSoundDeleteEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t(
        'events.guildSoundboardSoundDelete.soundboard_notification',
      ),
    )
    .setDescription(
      client.i18n.t('events.guildSoundboardSoundDelete.soundboard_disappear', {
        soundboard_name: soundboardSound.name,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Red);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, guildSoundboardSoundDeleteEmbed);

  client.logger.debug(`GuildSoundboardSoundDelete event completed for ${soundboardSound.name}`);
}
