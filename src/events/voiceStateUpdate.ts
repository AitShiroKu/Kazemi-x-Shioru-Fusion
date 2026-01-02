import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import { isVoiceChannelEmpty } from 'distube';
import type { Event } from '../handlers/types.js';

export const name = Events.VoiceStateUpdate;
export const once = false;

export async function execute(client: any, oldState: any, newState: any) {

  const guild = newState.guild;

  const voiceStateUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.voiceStateUpdate.voice_notification'))
    .setDescription(
      client.i18n.t('events.voiceStateUpdate.voice_update', {
        oldState: oldState.name,
        newState: newState.id,
      }),
    )
    .setTimestamp()
    .setColor(Colors.Yellow);

  // Initialize guild data
  await (client as any).initializeData(guild);

  // Send notification
  await (client as any).submitNotification(guild, name, voiceStateUpdateEmbed);

  if (oldState?.channel) {
    const voice = (client as any).player.voices.get(oldState);
    const queue = (client as any).player.queues.get(oldState);

    // Start a 60-second countdown to leave voice channel if it is empty
    const leaveTimeoutKey = `leave_timeout_${oldState.channel.id}`;

    if (voice && isVoiceChannelEmpty(oldState)) {
      // Prevent multiple timeouts for same channel
      if (!(client as any).temp[leaveTimeoutKey]) {
        (client as any).temp[leaveTimeoutKey] = setTimeout(() => {
          // Double-check if channel is still empty after 60 seconds
          if (isVoiceChannelEmpty(oldState)) {
            voice.leave();
            if (queue) {
              queue.textChannel.send(
                client.i18n.t('events.voiceStateUpdate.no_user_in_channel'),
              );
            } else {
              voice.channel.send(
                client.i18n.t('events.voiceStateUpdate.no_user_in_channel'),
              );
            }
          }
          delete (client as any).temp[leaveTimeoutKey];
        }, 60000);
      }
    } else if (voice && (client as any).temp[leaveTimeoutKey]) {
      // If someone joins back, clear the timeout
      clearTimeout((client as any).temp[leaveTimeoutKey]);
      delete (client as any).temp[leaveTimeoutKey];
    }

    // Pause the queue if there is no user in voice channel and resume it if there is
    if (queue) {
      if (isVoiceChannelEmpty(oldState)) {
        queue.pause();
      } else if (queue.paused) {
        queue.resume();
      }
    }
  }

  client.logger.debug(
    `VoiceStateUpdate event completed for ${oldState?.channel?.name || 'unknown'} -> ${newState.channel?.name || 'unknown'}`,
  );
}
