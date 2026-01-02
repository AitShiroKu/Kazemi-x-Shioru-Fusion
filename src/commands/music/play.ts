import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a song from YouTube or SoundCloud.')
  .setDescriptionLocalizations({ th: 'เล่น-หุดเพลงก็อด้หรือร้องเพลงให้ฟัง' })
  .setDefaultMemberPermissions(null)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addStringOption((option) =>
    option
      .setName('song')
      .setDescription('You can search for songs by name, ID or link.')
      .setDescriptionLocalizations({
        th: 'คุณสามารถค้นหาเพลงตามชื่อ, ID, หรือลิงค์',
      })
      .setRequired(true),
  )
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel that wants to play music.')
      .setDescriptionLocalizations({ th: 'ช่องที่ต้องการให้เธอเล่นเพลง' })
      .addChannelTypes(2),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.Speak,
  PermissionFlagsBits.Connect,
];
export const category = 'music';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputSong = interaction.options.getString('song') ?? '';
  const inputChannel = interaction.options.getChannel('channel') ?? '';

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!inputSong)
    return await interaction.reply({
      content: i18n('commands.play.no_song'),
      ephemeral: true,
    });

  const queue = (client.player as any).getQueue(interaction);

  if (queue && queue.paused)
    return await interaction.reply({
      content: i18n('commands.play.currently_playing'),
      ephemeral: true,
    });

  await interaction.deferReply();

  try {
    await (client.player as any).play(
      inputChannel || (interaction.member as any).voice.channel,
      inputSong,
      {
        member: interaction.member,
        message: false,
        textChannel: interaction.channel,
      },
    );
    await interaction.deleteReply();
  } catch (error: any) {
    if (error.code === 'VOICE_CONNECT_FAILED')
      return await interaction.editReply({
        content: i18n('commands.play.can_not_connect'),
      });
    if (error.code === 'NON_NSFW')
      return await interaction.editReply({
        content: i18n('commands.play.can_not_play_in_non_nsfw'),
      });
    if (!queue && inputChannel)
      return await interaction.editReply({
        content: i18n('commands.play.not_in_channel'),
      });
  }
}
