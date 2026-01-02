/**
 * Eat Command
 * Fake text saying who you are eating
 * Converted from Shioru/source/commands/fun/eat.js
 */

import {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('eat')
  .setDescription('Fake text saying who you are eating.')
  .setDescriptionLocalizations({ th: 'ข้อความปลอมที่บอกว่าคุณกำลังจะกินใคร' })
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
      .setName('name')
      .setDescription('The name of what you want to eat.')
      .setDescriptionLocalizations({ th: 'ชื่อของสิ่งที่คุณอยากกิน!' })
      .setRequired(true),
  );

export const permissions = [];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputName = interaction.options.getString('name');

  const authorUsername = interaction.user?.username || 'Unknown';
  const clientUsername = (interaction.client as any).user?.username || 'Unknown';
  const eatEmbed = new EmbedBuilder()
    .setDescription(
      (interaction.client as any).i18n
        .t('commands.eat.already_eaten')
        .replace('%s1', authorUsername)
        .replace('%s2', inputName),
    )
    .setColor(Colors.Blue);

  if (inputName === clientUsername) {
    await interaction.reply('...');
    setTimeout(async () => {
      await interaction.followUp(
        (interaction.client as any).i18n.t('commands.eat.do_not_eat_me'),
      );
    }, 8000);
    return;
  }

  await interaction.reply({ embeds: [eatEmbed] });
}

export default { data, execute, permissions, category };
