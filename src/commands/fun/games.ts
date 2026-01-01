/**
 * Games Command
 * Mini-games that can be played instantly
 * Converted from Shioru/source/commands/fun/games.js
 */

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('games')
  .setDescription('Mini-games that can be played instantly')
  .setDescriptionLocalizations({ th: 'มินิเกมที่สามารถเล่นได้ในทันที' })
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
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  await interaction.reply({
    content: '🎮 Games command is available! Use subcommands to play games.',
    ephemeral: true,
  });
}

export default { data, execute, permissions, category };
