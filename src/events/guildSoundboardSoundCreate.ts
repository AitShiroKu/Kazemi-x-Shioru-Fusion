import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../handlers/types.js';

export const name = Events.GuildSoundboardSoundCreate;
export const once = false;

export async function execute(client: any, soundboardSound: any) {

  const guild = soundboardSound.guild;

  const guildSoundboardSoundCreateEmbed = new EmbedBuilder()
    .setTitle(
      client.i18n.t(
        'events.guildSoundboardSoundCreate.soundboard_notification',
      ),
    )
    .setDescription(
      client.i18n.t('events.guildSoundboardSoundCreate.new_soundboard', {
        emoji_identifier: soundboardSound.emoji.identifier,
        soundboard_name: soundboardSound.name,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Green);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, guildSoundboardSoundCreateEmbed);

  client.logger.debug(`GuildSoundboardSoundCreate event completed for ${soundboardSound.name}`);
}
