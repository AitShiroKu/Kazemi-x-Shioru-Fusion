import {
  EmbedBuilder,
  Colors,
  Events,
  ActivityType,
  PresenceUpdateStatus,
} from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export async function execute(client: any) {
  // Log bot is online
  client.logger.info(`Bot is now online at ${client.readyAt.toLocaleString()}`);
  client.logger.info(`Sign in with username ${client.user.tag}`);
  client.logger.info(`Guilds: ${client.guilds.cache.size}`);
  client.logger.info(`Users: ${client.users.cache.size}`);

  // Set bot presence
  const activities = [
    {
      name: '🌸 Kazemi Miharu',
      type: ActivityType.Custom,
    },
  ];

  client.user.setPresence({
    status: PresenceUpdateStatus.Online,
    afk: false,
    activities,
  });

  // Set startup end time
  client.temp.startup.end = Date.now();

  const startupTime = (client.temp.startup.end - client.temp.startup.start) / 1000;
  client.logger.info(`Bot is ready to work on servers! (${startupTime}s)`);

  // Send webhook notification
  if (client.configs.logger.ready.enable && client.configs.logger.ready.webhookURL) {
    const webhookLogEmbed = new EmbedBuilder()
      .setColor(Colors.Green)
      .setTitle('✅・Ready')
      .setDescription('Bot is ready to work on servers!')
      .setTimestamp()
      .setFields([
        {
          name: '⌛ Time',
          value: `${startupTime}s`,
          inline: true,
        },
        {
          name: '🏷️ Guilds',
          value: client.guilds.cache.size.toString(),
          inline: true,
        },
        {
          name: '👥 Users',
          value: client.users.cache.size.toString(),
          inline: true,
        },
      ]);

    await (client as any).webhookSend(client.configs.logger.ready.webhookURL, {
      embeds: [webhookLogEmbed],
    });
  }

  client.logger.info('Ready event completed');
}
