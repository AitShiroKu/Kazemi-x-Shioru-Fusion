import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';

export const name = Events.ChannelCreate;
export const once = false;

export async function execute(client: any, channel: any) {

  const guild = channel.guild;

  const channelCreateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.channelCreate.channel_notification'))
    .setDescription(
      client.i18n
        .t('events.channelCreate.member_create_channel')
        .replace('%s1', channel.name)
        .replace('%s2', channel.id),
    )
    .setTimestamp()
    .setColor(Colors.Yellow)
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
    ]);

  // Send webhook notification
  if (client.configs.logger.channelCreate?.enable && client.configs.logger.channelCreate?.webhookURL) {
    await (client as any).webhookSend(client.configs.logger.channelCreate.webhookURL, {
      embeds: [channelCreateEmbed],
    });
  }

  client.logger.info(`Channel ${channel.name} (${channel.id}) was created`);
}
