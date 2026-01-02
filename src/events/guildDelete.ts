import { Events } from 'discord.js';
import type { Event } from '../handlers/types.js';

export const name = Events.GuildDelete;
export const once = false;

export async function execute(client: any, guild: any) {

  // Update statistics
  await (client as any).fetchStatistics('POST', 'size', client);
  await (client as any).fetchStatistics('POST', 'size/worked', client);

  client.logger.info(`Guild ${guild.name} (${guild.id}) was deleted`);
}
