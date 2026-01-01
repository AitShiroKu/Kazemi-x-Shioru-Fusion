import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';

export const name = Events.GuildCreate;
export const once = false;

export async function execute(client: any, guild: any) {
  // Send webhook notification
  if (client.configs.logger.guildCreate?.enable && client.configs.logger.guildCreate?.webhookURL) {
    const webhookLogEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('🆕・Guild Create')
      .setDescription('Bot has been added to a new server!')
      .setTimestamp()
      .setFields([
        {
          name: '🏷️ Name',
          value: guild.name,
          inline: true,
        },
        {
          name: '🆔 ID',
          value: guild.id,
          inline: true,
        },
        {
          name: '👥 Members',
          value: guild.memberCount.toString(),
          inline: true,
        },
        {
          name: '🌍 Locale',
          value: guild.preferredLocale ?? 'Unknown',
          inline: true,
        },
      ]);

    await (client as any).webhookSend(client.configs.logger.guildCreate.webhookURL, {
      embeds: [webhookLogEmbed],
    });
  }

  client.logger.info(`Guild ${guild.name} (${guild.id}) was added`);
}
