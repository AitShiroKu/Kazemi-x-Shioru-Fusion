/**
 * Event Handler - Loads all Discord events
 * Converted from Shioru's event.js to TypeScript
 */

import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { BotClient, Event } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadEvents(client: BotClient): void {
  client.logger.info('Verifying and loading all events...');

  const eventsPath = join(__dirname, '..', 'events');
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith('.js'),
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    // Dynamic import for ES modules
    import(pathToFileURL(filePath).href).then((eventModule) => {
      const event: Event = eventModule.default || eventModule;

      // Check event information
      client.logger.debug(
        `Checking details of ${event.name} event at (${filePath})`,
      );

      if (typeof event?.name !== 'string') {
        client.logger.warn(
          `Unable to load context ${event?.name} successfully - Missing "name" or "name" is not a string. Path: ${filePath}`,
        );
        return;
      }

      if (typeof event?.once !== 'boolean') {
        client.logger.warn(
          `Unable to load context ${event?.name} successfully - Missing "once" or "once" is not a boolean. Path: ${filePath}`,
        );
        return;
      }

      if (typeof event?.execute !== 'function') {
        client.logger.warn(
          `Unable to load context ${event?.name} successfully - Missing "execute" or "execute" is not a function. Path: ${filePath}`,
        );
        return;
      }

      if (event.once) {
        client.once(event.name, (...args) => event.execute(client, ...args));
      } else {
        client.on(event.name, (...args) => event.execute(client, ...args));
      }

      client.logger.info(`Loaded event: ${event.name}`);
    }).catch((error) => {
      client.logger.error(error, `Failed to load event file: ${file}`);
    });
  }
}
