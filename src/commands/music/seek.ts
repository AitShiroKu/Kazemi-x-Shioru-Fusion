import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('seek')
  .setDescription('Seek to a specific time in the song.')
  .setDescriptionLocalizations({ th: 'ขยนไปยังเวลาที่กำหนด' })
  .addIntegerOption((option) =>
    option
      .setName('seconds')
      .setDescription('Position in seconds')
      .setDescriptionLocalizations({ th: 'ตำแหนงเป็นวินาที' })
      .setRequired(true)
      .setMinValue(0),
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
  const seconds = interaction.options.getInteger('seconds', true);

  if (!queue || !queue.songs.length)
    return await interaction.reply({
      content: 'No music is playing.',
      ephemeral: true,
    });

  try {
    await (client.player as any).seek(interaction, seconds);
    await interaction.reply({
      content: `Seeked to ${seconds} seconds.`,
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
