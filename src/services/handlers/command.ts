/**
 * Command Handler - Loads all slash commands
 * Converted from Shioru's command.js to TypeScript
 */

import { Collection, PermissionsBitField, REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { BotClient, Command, CommandCategory } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function loadCommands(client: BotClient): Promise<void> {
  const foldersPath = join(__dirname, '../../commands');
  const commandFolders = readdirSync(foldersPath);

  client.cooldowns = new Collection();
  client.commands = new Collection();
  client.temp.commands = new Collection();

  client.logger.info('Verifying and loading all commands...');

  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder);
    
    // Skip if directory doesn't exist
    try {
      readdirSync(commandsPath);
    } catch {
      client.logger.warn(`Command directory not found: ${commandsPath}`);
      continue;
    }
    
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      (file.endsWith('.ts') && !file.endsWith('.d.ts')) || file.endsWith('.js'),
    );

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file);
      
      try {
        // Dynamic import for ES modules
        const commandModule = await import(pathToFileURL(filePath).href);
        const command: Command = commandModule.default || commandModule;

      if (!command.data || typeof command.data !== 'object') {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason: 'Missing or invalid "data" property. Command must have a SlashCommandBuilder instance.',
          },
          `Unable to load command ${file}`,
        );
        continue;
      }

      if (typeof command.execute !== 'function') {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason: 'You have a missing "execute" function or "execute" is not a function.',
          },
          `Unable to load command ${file}`,
        );
        continue;
      }

      if (!command.data.name) {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason: 'Command name is missing. Ensure SlashCommandBuilder.setName() was called.',
          },
          `Unable to load command ${file}`,
        );
        continue;
      }

      const commandName = command.data.name;

      client.logger.debug(
        `Loading command: ${commandName} from ${file}`,
      );

      if (client.commands.get(commandName)) {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason: `Found a command with a duplicate name as ${commandName}.`,
          },
          `Unable to load command ${commandName}`,
        );
        continue;
      }

      client.commands.set(commandName, command);

      // Store command info for help and other utilities
      const existingFolderData = client.temp.commands.get(folder) || {};
      const safeLocalizations = Object.fromEntries(
        Object.entries(command.data.description_localizations || {}).filter(
          ([, value]) => typeof value === 'string',
        ),
      );
      client.temp.commands.set(folder, {
        ...existingFolderData,
        [commandName]: {
          name: commandName,
          description: {
            'en-US': command.data.description || '',
            ...safeLocalizations,
          },
          cooldown: command.cooldown || 3,
          category: folder as CommandCategory,
          permissions: command.permissions
            ? new PermissionsBitField(command.permissions).toArray()
            : [],
          usage: (command as any).usage,
        },
      });

      client.logger.info(`Loaded command: ${commandName} (${folder})`);
      } catch (error) {
        client.logger.error(
          {
            path: filePath,
            type: 'command',
            error: error instanceof Error ? error.message : String(error),
          },
          `Failed to import command ${file}`,
        );
      }
    }
  }
}

/**
 * Register commands with Discord API
 */
export async function registerCommands(client: BotClient): Promise<void> {
  const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

  client.commands.forEach((command) => {
    commands.push(command.data.toJSON());
  });

  if (commands.length === 0) {
    client.logger.warn('No commands to register. Command collection is empty.');
    return;
  }

  const rest = new REST().setToken(client.configs.token);

  try {
    client.logger.info(`Started refreshing ${commands.length} application (/) commands.`);

    if (client.configs.testGuild) {
      // Register commands to test guild only (for development)
      await rest.put(
        Routes.applicationGuildCommands(
          client.configs.clientId,
          client.configs.testGuild,
        ),
        { body: commands },
      );
      client.logger.info(
        `Successfully registered ${commands.length} commands to test guild.`,
      );
    } else {
      // Register commands globally
      await rest.put(Routes.applicationCommands(client.configs.clientId), {
        body: commands,
      });
      client.logger.info(
        `Successfully registered ${commands.length} commands globally.`,
      );
    }
  } catch (error) {
    client.logger.error(error, 'Failed to register commands');
  }
}
