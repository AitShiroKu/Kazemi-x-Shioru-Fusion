import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';

export const name = Events.ChannelUpdate;
export const once = false;

export async function execute(client: any, oldChannel: any, newChannel: any) {

  const guild = oldChannel.guild;

  const channelUpdateEmbed = new EmbedBuilder()
    .setTitle(client.i18n.t('events.channelUpdate.channel_notification'))
    .setDescription(
      client.i18n
        .t('events.channelUpdate.member_update_channel')
        .replace('%s1', oldChannel.name)
        .replace('%s2', newChannel.name),
    )
    .setTimestamp()
    .setColor(Colors.Yellow)
    .setFields([
      {
        name: '🏷️ Name',
        value: newChannel.name,
        inline: true,
      },
      {
        name: '🆔 ID',
        value: newChannel.id,
        inline: true,
      },
      {
        name: '👥 Members',
        value: guild.memberCount.toString(),
        inline: true,
      },
    ]);

  // Update guild data
  await (client as any).initializeData(newChannel.guild);

  // Send webhook notification
  if (client.configs.logger.channelUpdate.enable && client.configs.logger.channelUpdate.webhookURL) {
    await (client as any).webhookSend(client.configs.logger.channelUpdate.webhookURL, {
      embeds: [channelUpdateEmbed],
    });
  }

  client.logger.info(`Channel ${oldChannel.name} (${oldChannel.id}) was updated to ${newChannel.name} (${newChannel.id})`);
}
