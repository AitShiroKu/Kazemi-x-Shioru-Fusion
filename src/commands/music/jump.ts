import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('jump')
  .setDescription('Jump to a specific song in the queue.')
  .setDescriptionLocalizations({ th: 'ข้ามไปยังเพลงที่ต้องการ' })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addIntegerOption((option) =>
    option
      .setName('index')
      .setDescription('The position of the song you want to jump to.')
      .setDescriptionLocalizations({
        th: 'ตำแหน่งของเพลย์ที่คุณต้องการข้ามไป',
      })
      .setRequired(true)
      .setMinValue(0),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'music';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputIndex = interaction.options.getInteger('index') ?? 0;

  const client = interaction.client as any;
  const queue = (client.player as any).getQueue(interaction);

  if (!queue || !queue.songs.length)
    return await interaction.reply({
      content: 'No music is playing.',
      ephemeral: true,
    });

  if (inputIndex < 0 || inputIndex >= queue.songs.length)
    return await interaction.reply({
      content: 'Invalid song position.',
      ephemeral: true,
    });

  try {
    await (client.player as any).jump(interaction, inputIndex);
    await interaction.reply({
      content: `Jumped to song at position ${inputIndex}`,
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
