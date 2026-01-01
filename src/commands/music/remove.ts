import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('remove')
  .setDescription('Remove a song from the queue.')
  .setDescriptionLocalizations({ th: 'ลบเพลงจากคิว' })
  .addIntegerOption((option) =>
    option
      .setName('position')
      .setDescription('Position of the song in the queue')
      .setDescriptionLocalizations({ th: 'ตำแหนงของเพลงในคิว' })
      .setRequired(true)
      .setMinValue(1),
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
  const position = interaction.options.getInteger('position', true);

  if (!queue || !queue.songs.length)
    return await interaction.reply({
      content: 'No music is playing.',
      ephemeral: true,
    });

  if (position < 1 || position > queue.songs.length)
    return await interaction.reply({
      content: 'Invalid position.',
      ephemeral: true,
    });

  try {
    const removed = queue.songs.splice(position - 1, 1)[0];
    await interaction.reply({
      content: `Removed: ${removed.name}`,
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
