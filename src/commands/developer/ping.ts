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
  const client = interaction.client as any;
  
  try {
    client.logger.debug('[PING] Starting ping command execution');
    
    // Check if i18n is initialized
    if (!client.i18n) {
      client.logger.error('[PING] i18n is not initialized on client');
      throw new Error('i18n is not initialized');
    }
    
    client.logger.debug('[PING] Sending initial reply');
    await interaction.reply({
      content: client.i18n.t('commands.ping.waiting'),
    });
    
    client.logger.debug('[PING] Fetching reply message');
    const message = await interaction.fetchReply();

    const roundtrip = message.createdTimestamp - interaction.createdTimestamp;
    const websocket = interaction.client.ws.ping;
    
    client.logger.debug(`[PING] Calculated latencies - Roundtrip: ${roundtrip}ms, WebSocket: ${websocket}ms`);

    // กำหนดสีตามค่า latency
    let color: number = Colors.Green;
    if (roundtrip > 200 || websocket > 200) {
      color = Colors.Yellow;
    }
    if (roundtrip > 400 || websocket > 400) {
      color = Colors.Red;
    }

    // กำหนด emoji สถานะ
    const getRoundtripEmoji = (latency: number) => {
      if (latency < 100) return '🟢';
      if (latency < 200) return '🟡';
      if (latency < 400) return '🟠';
      return '🔴';
    };

    const getWebsocketEmoji = (latency: number) => {
      if (latency < 100) return '🟢';
      if (latency < 200) return '🟡';
      if (latency < 400) return '🟠';
      return '🔴';
    };

    client.logger.debug('[PING] Creating embed');
    const pingEmbed = new EmbedBuilder()
      .setColor(color)
      .setTitle('🏓 ' + client.i18n.t('commands.ping.connection'))
      .addFields(
        {
          name: '🌐 Roundtrip Latency',
          value: `${getRoundtripEmoji(roundtrip)} \`${roundtrip}ms\``,
          inline: true,
        },
        {
          name: '📡 API Latency',
          value: `${getWebsocketEmoji(websocket)} \`${websocket}ms\``,
          inline: true,
        }
      )
      .setFooter({
        text: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    client.logger.debug('[PING] Editing reply with embed');
    await interaction.editReply({
      content: null,
      embeds: [pingEmbed],
    });
    
    client.logger.debug('[PING] Ping command completed successfully');
    
  } catch (error) {
    client.logger.error(error, '[PING] Error in ping command execution');
    
    // Try to send error message to user
    try {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ An error occurred while executing the ping command. Check logs for details.',
          ephemeral: true,
        });
      } else if (interaction.replied) {
        await interaction.followUp({
          content: '❌ An error occurred while executing the ping command. Check logs for details.',
          ephemeral: true,
        });
      }
    } catch (replyError) {
      client.logger.error(replyError, '[PING] Failed to send error reply to user');
    }
    
    throw error; // Re-throw to let interactionCreate handler also log it
  }
}

export default { data, execute, permissions, cooldown, category };