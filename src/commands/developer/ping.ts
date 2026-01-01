/**
 * Ping Command
 * Check the ping and API latency of the bot
 * Converted from Shioru/source/commands/developer/ping.js
 */

import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Check the ping and API latency of the bot.')
  .setDescriptionLocalizations({
    th: 'ตรวจสอบความหน่วงและ API Latency ของเซิร์ฟเวอร์',
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

export const cooldown = 5;
export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'developer';

export async function execute(interaction: ChatInputCommandInteraction) {
  const message = await interaction.reply({
    content: (interaction.client as any).i18n.t('commands.ping.waiting'),
    fetchReply: true,
  });
  const roundtrip = message.createdTimestamp - interaction.createdTimestamp;
  const websocket = interaction.client.ws.ping;

  const pingEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle((interaction.client as any).i18n.t('commands.ping.connection'))
    .setDescription(
      (interaction.client as any).i18n.t('commands.ping.info', {
        roundtrip_latency: roundtrip,
        websocket_latency: websocket,
      }),
    );

  await interaction.editReply({
    content: (interaction.client as any).i18n.t('commands.ping.result'),
    embeds: [pingEmbed],
  });
}

export default { data, execute, permissions, cooldown, category };
