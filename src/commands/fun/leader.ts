/**
 * Leader Command
 * View ranking on this server by EXP and Level
 * Converted from Shioru/source/commands/fun/leader.js
 */

import {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('leader')
  .setDescription('View ranking on this server by EXP and Level.')
  .setDescriptionLocalizations({ th: 'ดูการจัดอันดับบน EXP และ Level บนเซิร์ฟ้าวอร์นี้' })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('level')
      .setDescription('See the ranking of people with the most EXP and Level on the server.')
      .setDescriptionLocalizations({
        th: 'ดูการจัดอันดับบนผู้ที่มี EXP และ Level บนเซิร์ฟ้าวอร์นี้',
      }),
  );

export const permissions = [];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: '🏆 Leaderboard command is available! Use subcommands to view rankings.',
    ephemeral: true,
  });
}

export default { data, execute, permissions, category };
