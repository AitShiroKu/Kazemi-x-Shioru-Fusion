import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('join')
  .setDescription('Join voice channel.')
  .setDescriptionLocalizations({ th: 'เข้าร่วมช่องสัญญาณ' })
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel you want to join.')
      .setDescriptionLocalizations({ th: 'ช่องที่คุณต้องการ' })
      .setRequired(false),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.Connect,
];
export const category = 'music';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputChannel = interaction.options.getChannel('channel') ?? null;

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!inputChannel) {
    // Try to join the voice channel the user is in
    const voiceChannel = (interaction.member as any).voice.channel;
    if (voiceChannel) {
      try {
        await (client.player as any).voices.join(voiceChannel);
        await interaction.reply({
          content: i18n('commands.join.joined'),
        });
      } catch (error: any) {
        await interaction.reply({
          content: `Error: ${error.message}`,
          ephemeral: true,
        });
      }
    } else {
      await interaction.reply({
        content: i18n('commands.join.not_in_channel'),
        ephemeral: true,
      });
    }
  } else {
    // Join specified channel
    try {
      await (client.player as any).voices.join(inputChannel);
      await interaction.reply({
        content: i18n('commands.join.joined'),
      });
    } catch (error: any) {
      await interaction.reply({
        content: `Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }
}
