import {
  Events,
  EmbedBuilder,
  Colors,
} from 'discord.js';

export const name = Events.Error;
export const once = false;

export async function execute(client: any, error: Error) {
  const webhookLogEmbed = new EmbedBuilder()
    .setColor(Colors.Red)
    .setTitle('⚠️・Error')
    .setDescription(`\`\`\`${error.message}\`\``)
    .setTimestamp();

  if (client.configs.logger.error.enable && client.configs.logger.error.webhookURL) {
    await (client as any).webhookSend(client.configs.logger.error.webhookURL, {
      embeds: [webhookLogEmbed],
    });
  }

  client.logger.error(error, 'Error event occurred');
}
