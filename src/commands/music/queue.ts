import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  Colors,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageComponentInteraction,
} from 'discord.js';

function newLines(...parts: Array<string | undefined | null>): string {
  return parts.filter((p) => typeof p === 'string' && p.trim().length > 0).join('\n');
}

export const data = new SlashCommandBuilder()
  .setName('queue')
  .setDescription('Check songs in the queue')
  .setDescriptionLocalizations({ th: 'ตรวจสอบเพลงในคิว' })
  .setDefaultMemberPermissions(null)
  .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'music';

function controller(interaction: ChatInputCommandInteraction, currentQueue: any) {
  const currentSong = currentQueue.songs[0];

  const duration = currentSong?.stream?.playFromSource
    ? currentSong.duration
    : currentSong?.stream?.song?.duration || currentSong.duration;
  const durationCurrent = currentQueue.currentTime;
  const durationPercentage = Math.round((durationCurrent / duration) * 100);
  const durationBars = [
    '🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬',
    '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘',
  ];

  const durationBarIndex = Math.min(
    Math.floor((Number.isFinite(durationPercentage) ? durationPercentage : 0) / 5),
    durationBars.length - 1,
  );
  const durationLine = durationBars[durationBarIndex];

  const musicAction = currentQueue.paused ? '▶️' : '⏸️';

  const durationFormat = currentSong.formattedDuration;
  const durationCurrentFormat = currentQueue.formattedCurrentTime;
  const musicDuration = `${durationCurrentFormat} / ${durationFormat} \`${duration}\``;

  const volume = currentQueue.volume;
  const musicVolume =
    volume === 0
      ? '🔇 ○───'
      : volume <= 30
        ? '🔈 ─○──'
        : volume <= 70
          ? '🔉 ──○─'
          : '🔊 ───○';
  const musicVolumePercent = currentQueue.volume;

  const musicRepeat =
    currentQueue.repeatMode === 1
      ? '🔁'
      : currentQueue.repeatMode === 2
        ? '🔀'
        : '';

  const musicAutoplay = currentQueue.autoplay ? '📻' : '';

  const musicFilter = currentQueue.filters?.names?.length
    ? newLines(
        (interaction.client as any).i18n.t('commands.queue.filter'),
        `\`\`\`${currentQueue.filters.names.join(', ')}\`\`\``,
      )
    : '';

  const musicDisplay = newLines(
    durationLine,
    `${musicAction} ${musicDuration} ${musicVolume} \`${musicVolumePercent}%\` ${musicRepeat}${musicAutoplay}`,
    musicFilter,
  );

  const queueList = currentQueue.songs
    .slice(1, 10)
    .map((song: any, id: number) => `${id + 1}. ${song.name} - \`${song.formattedDuration}\``)
    .join('\n');

  const queuePreviousList = currentQueue.previousSongs
    .slice(0, 10)
    .map((song: any, id: number) => `${id + 1}. ${song.name} - \`${song.formattedDuration}\``)
    .join('\n');

  const descriptionParts: string[] = [musicDisplay];

  if (currentQueue.songs.length > 1) {
    descriptionParts.push(
      '\n' + (interaction.client as any).i18n.t('commands.queue.waiting_in_queue'),
      queueList,
    );
  }

  if (currentQueue.previousSongs?.length > 0) {
    descriptionParts.push(
      '\n' + (interaction.client as any).i18n.t('commands.queue.previous_queue'),
      queuePreviousList,
    );
  }

  const requester = currentSong.user;
  const queueAuthorUsername = requester?.username ?? 'Unknown';
  const avatarURL = requester?.displayAvatarURL?.() ?? undefined;

  const queueEmbed = new EmbedBuilder()
    .setTitle(currentSong.name)
    .setURL(currentSong.url)
    .setDescription(descriptionParts.join('\n'))
    .setColor(Colors.Blue)
    .setThumbnail(currentSong.thumbnail)
    .setTimestamp(currentQueue.createdTimestamp ?? new Date())
    .setFooter({
      text: (interaction.client as any).i18n.t('commands.queue.owner_this_queue', {
        username: queueAuthorUsername,
      }),
      iconURL: avatarURL,
    });

  const queueRow = new ActionRowBuilder<ButtonBuilder>();
  const repeatModes = [
    { emoji: '➡️', style: ButtonStyle.Secondary },
    { emoji: '🔁', style: ButtonStyle.Primary },
    { emoji: '🔀', style: ButtonStyle.Primary },
  ];

  if (currentQueue.previousSongs?.length > 0) {
    queueRow.addComponents(
      new ButtonBuilder()
        .setCustomId('music_previous')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('⏮️'),
    );
  }

  queueRow.addComponents(
    new ButtonBuilder()
      .setCustomId('music_play_pause')
      .setStyle(currentQueue.paused ? ButtonStyle.Secondary : ButtonStyle.Primary)
      .setEmoji(currentQueue.paused ? '▶️' : '⏸️'),
    new ButtonBuilder()
      .setCustomId('music_stop')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('⏹️'),
    new ButtonBuilder()
      .setCustomId('music_skip')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('⏭️'),
    new ButtonBuilder()
      .setCustomId('music_repeat')
      .setStyle(repeatModes[currentQueue.repeatMode]?.style ?? ButtonStyle.Secondary)
      .setEmoji(repeatModes[currentQueue.repeatMode]?.emoji ?? '➡️'),
    new ButtonBuilder()
      .setCustomId('music_autoplay')
      .setStyle(!currentQueue.autoplay ? ButtonStyle.Secondary : ButtonStyle.Primary)
      .setEmoji('📻'),
  );

  return { queueEmbed, queueRow };
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const queue = (client.player as any).getQueue(interaction);

  if (!queue) {
    await interaction.reply(i18n('commands.queue.no_queue'));
    return;
  }

  const { queueEmbed, queueRow } = controller(interaction, queue);

  await interaction.reply({ embeds: [queueEmbed], components: [queueRow] });

  const channel: any = interaction.channel;
  if (!channel?.createMessageComponentCollector) return;

  const queueDurationMs = (queue.duration || 60) * 1000;
  const collector = channel.createMessageComponentCollector({
    filter: (inter: MessageComponentInteraction) => inter.user.id === interaction.user.id,
    time: queueDurationMs,
  });

  const updateEmbed = async () => {
    const currentQueue = (client.player as any).getQueue(interaction);
    if (!currentQueue) return;

    const currentQueueDurationMs = (queue.duration || 60) * 1000;
    const { queueEmbed: updatedEmbed, queueRow: updatedRow } = controller(
      interaction,
      currentQueue,
    );

    collector.resetTimer({ time: currentQueueDurationMs });

    try {
      await interaction.editReply({
        embeds: [updatedEmbed],
        components: [updatedRow],
      });
    } catch {
      // ignore
    }
  };

  const player = client.player;
  const queueId = queue.id || interaction.guildId || interaction.channelId;
  const intervalId = setInterval(updateEmbed, 5000);

  const isSameQueue = (currentQueue: any) => {
    const currentId = currentQueue?.id || currentQueue?.guild?.id || currentQueue?.channel?.id;
    return currentId === queueId;
  };

  const onFinishSong = async (currentQueue: any) => {
    if (isSameQueue(currentQueue)) await updateEmbed();
  };
  const onAddSong = async (currentQueue: any) => {
    if (isSameQueue(currentQueue)) await updateEmbed();
  };
  const onAddList = async (currentQueue: any) => {
    if (isSameQueue(currentQueue)) await updateEmbed();
  };
  const onDeleteQueue = async (currentQueue: any) => {
    if (isSameQueue(currentQueue)) {
      try {
        await interaction.editReply({ components: [] });
      } catch {
        // ignore
      }
    }
  };
  const onFinish = async (currentQueue: any) => {
    if (isSameQueue(currentQueue)) await updateEmbed();
  };

  try {
    player.on('finishSong', onFinishSong);
    player.on('addSong', onAddSong);
    player.on('addList', onAddList);
    player.on('deleteQueue', onDeleteQueue);
    player.on('finish', onFinish);
  } catch {
    // ignore
  }

  collector.on('collect', async (inter: any) => {
    try {
      const currentQueue = (client.player as any).getQueue(inter);

      if (!currentQueue) {
        await inter.reply({ content: i18n('commands.queue.no_queue'), ephemeral: true });
        return;
      }

      switch (inter.customId) {
        case 'music_previous': {
          if (currentQueue.previousSongs?.length > 0) {
            await currentQueue.previous();
            await updateEmbed();
            await inter.deferUpdate();
          } else {
            await inter.reply({
              content: i18n('commands.queue.no_previous_song'),
              ephemeral: true,
            });
          }
          break;
        }

        case 'music_play_pause': {
          if (currentQueue.paused) await currentQueue.resume();
          else await currentQueue.pause();

          await updateEmbed();
          await inter.deferUpdate();
          break;
        }

        case 'music_stop': {
          await currentQueue.stop();
          collector.stop();
          break;
        }

        case 'music_skip': {
          if (currentQueue.songs?.length > 1) {
            await currentQueue.skip();
            await updateEmbed();
            await inter.deferUpdate();
          } else {
            await inter.reply({
              content: i18n('commands.queue.no_next_song'),
              ephemeral: true,
            });
          }
          break;
        }

        case 'music_repeat': {
          const nextRepeatMode = (Number(currentQueue.repeatMode) + 1) % 3;
          await currentQueue.setRepeatMode(nextRepeatMode);
          await updateEmbed();
          await inter.deferUpdate();
          break;
        }

        case 'music_autoplay': {
          try {
            currentQueue.toggleAutoplay(!currentQueue.autoplay);
          } catch {
            (client.player as any).toggleAutoplay(interaction);
          }
          await updateEmbed();
          await inter.deferUpdate();
          break;
        }
      }
    } catch (error) {
      client.logger?.error?.(error);
      try {
        await inter.reply({ content: i18n('commands.queue.no_queue'), ephemeral: true });
      } catch {
        // ignore
      }
    }
  });

  collector.on('end', async () => {
    try {
      await interaction.editReply({ components: [] });
    } catch {
      // ignore
    }

    try {
      player.off('finishSong', onFinishSong);
      player.off('addSong', onAddSong);
      player.off('addList', onAddList);
      player.off('deleteQueue', onDeleteQueue);
      player.off('finish', onFinish);
    } catch {
      // ignore
    }

    clearInterval(intervalId);
  });
}

export default { data, execute, permissions, category };
