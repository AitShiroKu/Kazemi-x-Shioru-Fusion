import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.GuildCreate;
export const once = false;

export async function execute(client: any, guild: any) {
  // Initialize guild data in database
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

  // Update statistics
  const statisticsRef = client.database.ref('statistics/size');
  const statisticsSnapshot = await statisticsRef.get();
  const statisticsVal = statisticsSnapshot.val();

  const commandSize = client.temp.commands.size ?? 0;
  const guildSize = client.guilds.cache.size ?? 0;
  const userSize = client.users.cache.size ?? 0;

  if (statisticsVal?.commands !== commandSize) {
    await statisticsRef.update({ commands: commandSize });
  }
  if (statisticsVal?.guilds !== guildSize) {
    await statisticsRef.update({ guilds: guildSize });
  }
  if (statisticsVal?.users !== userSize) {
    await statisticsRef.update({ users: userSize });
  }

  // Send webhook notification
  if (client.configs.logger.guildCreate.enable && client.configs.logger.guildCreate.webhookURL) {
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
