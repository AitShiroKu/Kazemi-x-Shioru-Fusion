import { Events, EmbedBuilder, Colors } from "discord.js";
import { config } from "../services/config/config.js";

export const name = Events.Debug;
export const once = false;

export async function execute(client: any, info: string) {
  // Always log debug info to the logger
  client?.logger?.debug(info);

  // Send webhook notification if debug mode and webhook are configured
  if (config.debug.enable && config.debug.webhookURL) {
    try {
      const webhookLogEmbed = new EmbedBuilder()
        .setTimestamp()
        .setColor(Colors.Yellow)
        .setTitle("📜・Debug")
        .setDescription(`\`\`\`${info}\`\`\``);

      await client.webhookSend(config.debug.webhookURL, {
        embeds: [webhookLogEmbed],
      });
    } catch (error) {
      client?.logger?.error("Failed to send debug webhook:", error);
    }
  }
}
