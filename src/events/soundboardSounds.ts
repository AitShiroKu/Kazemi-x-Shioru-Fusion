import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.SoundboardSounds;
export const once = false;

export async function execute(client: any, soundboardSounds: any, guild: any) {

  const guildSoundboardSoundUpdateEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t('events.soundboardSounds.soundboard_notification'),
    )
    .setDescription(
      client.i18n.t('events.soundboardSounds.soundboards_changed', {
        count: soundboardSounds.size,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Blue);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, guildSoundboardSoundUpdateEmbed);

  client.logger.debug(`SoundboardSounds event completed for ${guild.name}`);
}
