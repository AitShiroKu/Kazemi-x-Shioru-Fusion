import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('lyrics')
  .setDescription('Get lyrics for the current song.')
  .setDescriptionLocalizations({ th: 'ดเนเนื้อเพลงปัจจุบย' })
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
    const lyrics = await (client.player as any).getLyrics(interaction);
    if (!lyrics)
      return await interaction.reply({
        content: 'No lyrics found for this song.',
        ephemeral: true,
      });

    await interaction.reply({
      content: lyrics.substring(0, 4096),
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
