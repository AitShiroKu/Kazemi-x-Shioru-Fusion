import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';
import type { Event } from '../handlers/types.js';

export const name = Events.Warn;
export const once = false;

export async function execute(client: any, info: string) {
  const webhookLogEmbed = new EmbedBuilder()
    .setTimestamp()
    .setColor(Colors.Orange)
    .setTitle('📜・Warn')
    .setDescription(`\`\`\`${info}\`\`\``);

  // Send webhook notification

  if (client?.configs?.logger?.warn?.enable && client?.configs?.logger?.warn?.webhookURL) {
    await (client as any).webhookSend(
      client.configs.logger.warn.webhookURL,
      {
        embeds: [webhookLogEmbed],
      },
    );
  }

  client?.logger?.warn(info);
}
