import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('volume')
  .setDescription('Change the volume of the music.')
  .setDescriptionLocalizations({ th: 'เปลี่ยนระดับเสียง' })
  .addIntegerOption((option) =>
    option
      .setName('level')
      .setDescription('Volume level (0-100)')
      .setDescriptionLocalizations({ th: 'ระดับเสียง (0-100)' })
      .setRequired(false)
      .setMinValue(0)
      .setMaxValue(100),
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
  const level = interaction.options.getInteger('level');

  if (!queue || !queue.songs.length)
    return await interaction.reply({
      content: 'No music is playing.',
      ephemeral: true,
    });

  try {
    const currentVolume = queue.volume;
    const newVolume = level !== null ? level : currentVolume;

    await (client.player as any).setVolume(interaction, newVolume);

    await interaction.reply({
      content: `Volume: ${newVolume}%`,
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
