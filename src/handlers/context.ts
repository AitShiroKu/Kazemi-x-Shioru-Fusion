/**
 * Context Handler - Loads all context menu commands
 * Converted from Shioru's context.js to TypeScript
 */

import { Collection, PermissionsBitField } from 'discord.js';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { BotClient, Context } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadContexts(client: BotClient): void {
  client.contexts = new Collection();
  client.temp.contexts = new Collection();

  client.logger.info('Verifying and loading all contexts...');

  const contextsPath = join(__dirname, '..', 'contexts');
  const contextFiles = readdirSync(contextsPath).filter((file) =>
    file.endsWith('.js'),
  );

  for (const file of contextFiles) {
    const filePath = join(contextsPath, file);
    // Dynamic import for ES modules
    import(pathToFileURL(filePath).href).then((contextModule) => {
      const context: Context = contextModule.default || contextModule;

      client.logger.debug(
        `Checking details of ${file} context at (${filePath})`,
      );

      if (typeof context.data !== 'object') {
        client.logger.warn(
          `Unable to load context ${file} successfully - Missing "data" or "data" is not an object. Path: ${filePath}`,
        );
        return;
      }

      if (typeof context.execute !== 'function') {
        client.logger.warn(
          `Unable to load context ${file} successfully - Missing "execute" or "execute" is not a function. Path: ${filePath}`,
        );
        return;
      }

      const contextName = context.data.name;

      if (client.contexts.get(contextName)) {
        client.logger.warn(
          `Unable to load context ${contextName} successfully - Found a context with a duplicate name as ${contextName}. Path: ${filePath}`,
        );
        return;
      }

      client.contexts.set(contextName, context);

      // Store context info for help and other utilities
      client.temp.contexts.set(contextName, {
        type: context.data.type ?? 0,
        cooldown: context.cooldown ?? 3,
        name: contextName,
        permissions: context.permissions
          ? new PermissionsBitField(context.permissions).toArray()
          : [],
      });

      client.logger.info(`Loaded context: ${contextName}`);
    }).catch((error) => {
      client.logger.error(error, `Failed to load context file: ${file}`);
    });
  }
}
