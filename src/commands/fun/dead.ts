/**
 * Dead Command
 * Fake message that says you commit suicide.
 * Converted from Shioru/source/commands/fun/dead.js
 */

import {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('dead')
  .setDescription('Fake message that says you commit suicide.')
  .setDescriptionLocalizations({
    th: 'ข้อความปลอมที่บอกว่าคุณฆ่าตัวตาย',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  const authorUsername = interaction.user?.username || 'Unknown';
  const deadEmbed = new EmbedBuilder()
    .setDescription(
      (interaction.client as any).i18n.t('commands.dead.suicide').replace('%s', authorUsername),
    )
    .setColor('Default');

  await interaction.reply({ embeds: [deadEmbed] });
}

export default { data, execute, permissions, category };
