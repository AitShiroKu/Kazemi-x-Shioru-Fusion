import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.Debug;
export const once = false;

export async function execute(info: string) {
  const webhookLogEmbed = new EmbedBuilder()
    .setTimestamp()
    .setColor(Colors.Yellow)
    .setTitle('📜・Debug')
    .setDescription(`\`\`\`${info}\`\`\``);

  // Send webhook notification
  const client = (global as any).client;
  if (client?.configs?.logger?.debug?.enable && client?.configs?.logger?.debug?.webhookURL) {
    await (client as any).webhookSend(
      client.configs.logger.debug.webhookURL,
      {
        embeds: [webhookLogEmbed],
      },
    );
  }

  client?.logger?.debug(info);
}
