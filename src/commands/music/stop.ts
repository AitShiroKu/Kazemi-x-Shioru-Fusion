import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop the music and clear the queue.')
  .setDescriptionLocalizations({ th: 'หยุดเพลงและลบคิว' })
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

  if (!queue || !queue.songs.length)
    return await interaction.reply({
      content: 'No music is playing.',
      ephemeral: true,
    });

  try {
    await (client.player as any).stop(interaction);
    await interaction.reply({
      content: 'Stopped music and cleared queue.',
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
