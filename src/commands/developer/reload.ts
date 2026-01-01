/**
 * Reload Command
 * Reload modified commands and contexts
 * Converted from Shioru/source/commands/developer/reload.js
 */

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
} from 'discord.js';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { Command, BotClient } from '../../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const data = new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reload modified command.')
  .setDescriptionLocalizations({
    th: 'โหลดคำสั่งใหม่ที่ได้รับการแก้ไขอีกครั้ง',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addStringOption((option) =>
    option
      .setName('command')
      .setDescription('Name of command to reload.')
      .setDescriptionLocalizations({ th: 'ชื่อของคำสั่งที่ต้องการโหลดใหม่' })
      .setMinLength(3)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName('context')
      .setDescription('Name of context to reload.')
      .setDescriptionLocalizations({ th: 'ชื่อของบริบทที่ต้องการโหลดใหม่' })
      .setMinLength(3)
      .setAutocomplete(true),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'developer';

export async function autocomplete(interaction: AutocompleteInteraction) {
  const focusedOption = interaction.options.getFocused(true);
  const inputCommand = interaction.options.getString('command') ?? '';
  const inputContext = interaction.options.getString('context') ?? '';

  let choices: string[] = [];

  if (focusedOption.name === 'command') {
    if (inputCommand) {
      choices = (interaction.client as BotClient).commands
        .map((value) =>
          (value.data.name as string).includes(inputCommand.toLowerCase())
            ? (value.data.name as string)
            : null,
        )
        .filter((item): item is string => item !== null)
        .slice(0, 25);
    } else {
      choices = (interaction.client as BotClient).commands
        .sort(() => Math.random() - 0.5)
        .map((value) => value.data.name as string)
        .slice(0, 25);
    }
  }
  if (focusedOption.name === 'context') {
    if (inputContext) {
      choices = (interaction.client as BotClient).contexts
        .map((value) =>
          (value.data.name as string).includes(inputContext.toLowerCase())
            ? (value.data.name as string)
            : null,
        )
        .filter((item): item is string => item !== null)
        .slice(0, 25);
    } else {
      choices = (interaction.client as BotClient).contexts
        .sort(() => Math.random() - 0.5)
        .map((value) => value.data.name as string)
        .slice(0, 25);
    }
  }

  const filtered = choices.filter((choice) =>
    choice.startsWith(focusedOption.value as string),
  );

  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice })),
  );
}

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputCommand = interaction.options.getString('command') ?? '';
  const inputContext = interaction.options.getString('context') ?? '';

  await interaction.reply(
    (interaction.client as any).i18n.t('commands.reload.searching'),
  );

  const reload = async (path: string, name: string) => {
    try {
      (interaction.client as BotClient).commands.delete(name);

      const url = `${pathToFileURL(path).href}?update=${Date.now()}`;
      const newModule = await import(url);
      const newCommand: Command = (newModule as any).default || (newModule as any);

      (interaction.client as BotClient).commands.set(newCommand.data.name, newCommand);
      await interaction.followUp(
        (interaction.client as any).i18n.t('commands.reload.reloaded', {
          command_name: name,
        }),
      );
    } catch (error) {
      await interaction.followUp(
        (interaction.client as any).i18n.t('commands.reload.reload_error', {
          command_name: name,
        }),
      );
      (interaction.client as any).logger.error(error);
    }
  };

  if (inputCommand) {
    const command = Array.from(
      (interaction.client as BotClient).temp.commands.values(),
    )
      .flatMap((folderCommands) => Object.values(folderCommands))
      .find((cmd) => cmd.name === inputCommand.toLowerCase());

    if (!command) {
      return await interaction.followUp(
        (interaction.client as any).i18n.t('commands.reload.invalid_command'),
      );
    }

    const commandName = command.name;
    const commandCategory = command.category;
    const commandPath = join(
      __dirname,
      '..',
      commandCategory.toLowerCase(),
      `${commandName}.js`,
    );

    await reload(commandPath, commandName);
  }
  if (inputContext) {
    const context = (interaction.client as BotClient).temp.contexts.get(
      inputContext.toLowerCase(),
    );

    if (!context) {
      return await interaction.followUp(
        (interaction.client as any).i18n.t('commands.reload.invalid_command'),
      );
    }

    const contextName = context.name;
    const contextPath = join(
      __dirname,
      '..',
      '..',
      'contexts',
      `${contextName}.js`,
    );

    await reload(contextPath, contextName);
  }
}

export default { data, execute, permissions, category, autocomplete };
