import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.ChannelCreate;
export const once = false;

export async function execute(channel: any) {
  const client = channel.client;
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

  // Initialize guild data
  const guildRef = client.database.ref(`guilds/${guild.id}`);
  const guildSnapshot = await guildRef.get();

  if (!guildSnapshot.exists()) {
    await guildRef.set({
      joinedAt: guild.joinedAt?.toISOString() ?? new Date(guild.createdAt).toISOString(),
      createdAt: new Date(guild.createdAt).toISOString(),
      description: guild.description ?? '',
      iconURL: guild.iconURL() ?? '',
      preferredLocale: guild.preferredLocale ?? 'en-US',
      memberCount: guild.memberCount ?? 0,
      name: guild.name ?? '',
      verified: guild.verified ?? false,
      language: {
        type: 'AUTO',
        locale: 'en-US',
      },
      notify: {
        message: { enable: true },
        join: { enable: true },
        leave: { enable: true },
        ban: { enable: true },
        kick: { enable: false },
        member: { enable: true },
        role: { enable: true },
      },
      djs: {
        enable: true,
        roles: [],
        users: [],
      },
      level: {
        enable: true,
        multiplier: 1,
        xp: 15,
      },
      afk: {},
      automod: {
        enable: false,
        antiBot: {
          enable: false,
          all: false,
          bots: [],
        },
        antiSpam: {
          enable: false,
          limit: 5,
          muteTime: 30000,
        },
        antiLink: {
          enable: false,
          muteTime: 30000,
        },
        antiMassMention: {
          enable: false,
          limit: 10,
          muteTime: 30000,
        },
      },
    });

    client.logger.info(`Initialized data for guild ${guild.name} (${guild.id})`);
  }

  // Send webhook notification
  if (client.configs.logger.channelCreate.enable && client.configs.logger.channelCreate.webhookURL) {
    await (client as any).webhookSend(client.configs.logger.channelCreate.webhookURL, {
      embeds: [channelCreateEmbed],
    });
  }

  client.logger.info(`Channel ${channel.name} (${channel.id}) was created`);
}
