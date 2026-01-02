import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('repeat')
  .setDescription('Toggle repeat mode.')
  .setDescriptionLocalizations({ th: 'เปลี่ยนโหมดเล่นซ้ำ' })
  .addStringOption((option) =>
    option
      .setName('mode')
      .setDescription('Repeat mode')
      .setDescriptionLocalizations({ th: 'โหมดเล่นซ้ำ' })
      .setRequired(false)
      .addChoices(
        { name: 'Off', value: 'off' },
        { name: 'Song', value: 'song' },
        { name: 'Queue', value: 'queue' },
      ),
  )
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'music';

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const queue = (client.player as any).getQueue(interaction);
  const mode = interaction.options.getString('mode');

  if (!queue || !queue.songs.length)
    return await interaction.reply({
      content: 'No music is playing.',
      ephemeral: true,
    });

  try {
    let repeatMode: number;
    switch (mode) {
      case 'off':
        repeatMode = 0;
        break;
      case 'song':
        repeatMode = 1;
        break;
      case 'queue':
        repeatMode = 2;
        break;
      default:
        repeatMode = queue.repeatMode === 0 ? 1 : queue.repeatMode === 1 ? 2 : 0;
    }

    await (client.player as any).setRepeatMode(interaction, repeatMode);

    const modeText = repeatMode === 0 ? 'Off' : repeatMode === 1 ? 'Song' : 'Queue';
    await interaction.reply({
      content: `Repeat mode: ${modeText}`,
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
