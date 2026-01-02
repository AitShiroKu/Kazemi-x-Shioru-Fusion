/**
 * Player Handler - DisTube music player events
 * Converted from Shioru's player.js to TypeScript
 */

import { EmbedBuilder, Colors, type VoiceBasedChannel } from 'discord.js';
import { Events, type Queue, type Song, type DisTube } from 'distube';
import { EmbedBuilderService } from './embedBuilder.js';

export function setupPlayerEvents(client: any): void {
  const webhookLogEmbed = new EmbedBuilder()
    .setTitle('🎹・Player')
    .setTimestamp();

  // Add List Event
  client.player.on(Events.ADD_LIST, (queue: Queue, playlist: any) => {
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(
        `Queue: \`${queue}\`\nPlaylist: \`${playlist}\``,
      )
      .setFields([
        {
          name: 'Event',
          value: Events.ADD_LIST,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
      // webhookSend(client.configs.logger.player, { embeds: [webhookLogEmbed] });
    }

    queue.textChannel?.send(
      client.i18n.t('handlers.player.addList.added_list', {
        playlist_name: playlist.name,
        amount: playlist.songs.length,
      }),
    );
  });

  // Add Song Event
  client.player.on(Events.ADD_SONG, (queue: Queue, song: Song) => {
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(`Queue: \`${queue}\`\nSong: \`${song}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.ADD_SONG,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.music({
      title: '🎵 Added to Queue',
      description: `**${song.name}**\n\`${song.formattedDuration}\``,
      thumbnail: song.thumbnail,
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Debug Event
  client.player.on(Events.DEBUG, (debug: string) => {
    webhookLogEmbed
      .setColor(Colors.Blue)
      .setDescription(`Debug: \`${debug}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.DEBUG,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }
  });

  // Delete Queue Event
  client.player.on(Events.DELETE_QUEUE, (queue: Queue) => {
    webhookLogEmbed
      .setColor(Colors.Red)
      .setDescription(`Queue: \`${queue}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.DELETE_QUEUE,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.warning({
      title: '🗑️ Queue Deleted',
      description: client.i18n.t('handlers.player.deleteQueue.deleted_queue'),
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Disconnect Event
  client.player.on(Events.DISCONNECT, (queue: Queue) => {
    webhookLogEmbed
      .setColor(Colors.Default)
      .setDescription(`Queue: \`${queue}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.DISCONNECT,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.info({
      title: '🔌 Disconnected',
      description: client.i18n.t('handlers.player.disconnect.disconnected'),
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Empty Event
  client.player.on(Events.EMPTY, (queue: Queue) => {
    webhookLogEmbed
      .setColor(Colors.Default)
      .setFields([
        {
          name: 'Event',
          value: Events.EMPTY,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.info({
      title: '📭 Voice Channel Empty',
      description: 'The voice channel is empty. Leaving...',
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Error Event
  client.player.on(Events.ERROR, (error: Error, queue: Queue, song: Song) => {
    const meChannel = queue.voiceChannel as VoiceBasedChannel;
    const connection = client.player.voices.get(meChannel.guild);

    if (error.message.includes('Unknown Playlist')) {
      const embed = EmbedBuilderService.error({
        title: '❌ Playlist Not Found',
        description: client.i18n.t('handlers.player.error.playlist_not_found'),
      });
      queue.textChannel?.send({ embeds: [embed] });
      return;
    }

    if (connection) {
      connection.leave(meChannel.guild);
    }

    webhookLogEmbed
      .setColor(Colors.Red)
      .setDescription(
        `Error: \`${error}\`\nQueue: \`${queue}\`\nSong: \`${song}\``,
      )
      .setFields([
        {
          name: 'Event',
          value: Events.ERROR,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    client.logger.error(error, 'Music player error');

    const embed = EmbedBuilderService.error({
      title: '❌ Player Error',
      description: `An error occurred while playing music.\n\`\`\`${error.message}\`\`\``,
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Finish Event
  client.player.on(Events.FINISH, (queue: Queue) => {
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(`Queue: \`${queue}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.FINISH,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.success({
      title: '✅ Queue Finished',
      description: client.i18n.t('handlers.player.finish.queue_is_empty'),
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Finish Song Event
  client.player.on(Events.FINISH_SONG, (queue: Queue, song: Song) => {
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(`Queue: \`${queue}\`\nSong: \`${song}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.FINISH_SONG,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.success({
      title: '✅ Song Finished',
      description: `**${song.name}**\n\`${song.formattedDuration}\``,
      thumbnail: song.thumbnail,
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Init Queue Event
  client.player.on(Events.INIT_QUEUE, (queue: Queue) => {
    queue.autoplay = false;
    queue.volume = 100;
    (queue as any).filters = 'clear';
    (queue as any).createdTimestamp = new Date();

    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(`Queue: \`${queue}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.INIT_QUEUE,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }
  });

  // No Related Event
  client.player.on(Events.NO_RELATED, (queue: Queue, error: any) => {
    webhookLogEmbed
      .setColor(Colors.Green)
      .setDescription(`Queue: \`${queue}\`\nError: \`${error}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.NO_RELATED,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.info({
      title: 'ℹ️ No Related Songs',
      description: client.i18n.t('handlers.player.noRelated.no_related'),
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  // Play Song Event
  client.player.on(Events.PLAY_SONG, (queue: Queue, song: Song) => {
    webhookLogEmbed
      .setColor(Colors.White)
      .setDescription(`Queue: \`${queue}\`\nSong: \`${song}\``)
      .setFields([
        {
          name: 'Event',
          value: Events.PLAY_SONG,
          inline: true,
        },
      ]);

    if (client.configs.logger.player?.enable && client.configs.logger.player?.webhookURL) {
      // Send to webhook if configured
    }

    const embed = EmbedBuilderService.music({
      title: '🎵 Now Playing',
      description: `**${song.name}**\n\`${song.formattedDuration}\``,
      thumbnail: song.thumbnail,
      fields: [
        {
          name: 'Requested by',
          value: (song as any).user?.username || 'Unknown',
          inline: true,
        },
      ],
    });

    queue.textChannel?.send({ embeds: [embed] });
  });

  client.logger.info('Player events loaded successfully');
}
