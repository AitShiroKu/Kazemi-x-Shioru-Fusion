import {
  Events,
  Collection,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';
import type { Event } from '../types/index.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: ChatInputCommandInteraction | AutocompleteInteraction | MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction) {
  const client = interaction.client as any;

  if (interaction.user.bot) return;

  // Auto-initialize guild data
  if (interaction.guild) {
    const guildRef = client.database.ref(`guilds/${interaction.guildId}`);
    const guildSnapshot = await guildRef.get();

    if (!guildSnapshot.exists()) {
      await guildRef.set({
        language: { type: 'AUTO' },
        notify: {
          message: { enable: true },
          join: { enable: true },
          leave: { enable: true },
          ban: { enable: true },
          kick: { enable: true },
          member: { enable: true },
          role: { enable: true },
        },
        djs: {
          enable: true,
          roles: [],
          users: [],
        },
        level: {
          enable: true,
          multiplier: 1,
          xp: 15,
        },
        afk: {},
        automod: {
          enable: false,
          antiBot: {
            enable: false,
            all: false,
            bots: [],
          },
          antiSpam: {
            enable: false,
            limit: 5,
            muteTime: 300000,
          },
          antiLink: {
            enable: false,
            muteTime: 300000,
          },
          antiMassMention: {
            enable: false,
            limit: 10,
            muteTime: 300000,
          },
        },
      });
    }
  }

  // Handle chat input commands
  if (interaction.isChatInputCommand()) {
    const commandName = interaction.commandName;
    const command = client.temp.commands.get(commandName);

    if (!command) {
      client.logger.warn(`No command matching ${commandName} was found.`);
      return;
    }

    // Check cooldown
    if (!client.cooldowns.has(commandName))
      client.cooldowns.set(commandName, new Collection());

    const now = Date.now();
    const timestamps = client.cooldowns.get(commandName);
    const cooldownAmount = (command.cooldown ?? 3) * 1000;

    if (timestamps.has(interaction.user.id)) {
      const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

      if (now < expirationTime) {
        const expiredTimestamp = Math.round(expirationTime / 1000);
        await interaction.reply({
          content: client.i18n.t('events.interactionCreate.command_has_cooldown', {
            command_name: commandName,
            expired_timestamp: expiredTimestamp,
          }),
          flags: { ephemeral: true } as any,
        });
      }
    }

    timestamps.set(interaction.user.id, now);
    setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

    // Check permissions
    if (command.permissions) {
      const member = interaction.member as any;
      if (!member.permissions.has(command.permissions)) {
        return interaction.reply({
          content: client.i18n.t('events.interactionCreate.client_is_not_allowed', {
            permissions: command.permissions.toArray(),
          }),
          flags: { ephemeral: true } as any,
        });
      }
    }

    try {
      await command.execute(interaction);

      // Update statistics
      if (interaction.guild) {
        client.database.ref(`statistics/${interaction.guildId}/commands/${commandName}`).transaction((count: any) => {
          if (count === null) return count + 1;
          return count + 1;
        });
      }
    } catch (error) {
      client.logger.error(error, `Error executing command ${commandName}`);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: client.i18n.t('events.interactionCreate.error_executing_command', {
            command_name: commandName,
          }),
        });
      }
    }
  }

  // Handle autocomplete
  if (interaction.isAutocomplete()) {
    const commandName = interaction.commandName;
    const command = client.temp.commands.get(commandName);

    if (!command) {
      client.logger.warn(`No autocomplete matching ${commandName} was found.`);
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      client.logger.error(error);
    }
  }

  // Handle context menu commands
  if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
    const contextName = interaction.commandName;
    const context = client.temp.contexts.get(contextName);

    if (!context) {
      client.logger.warn(`No context matching ${contextName} was found.`);
      return;
    }

    try {
      await context.execute(interaction);
    } catch (error) {
      client.logger.error(error, `Error executing context ${contextName}`);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: client.i18n.t('events.interactionCreate.error_executing_command', {
            command_name: contextName,
          }),
        });
      }
    }
  }

  client.logger.debug('InteractionCreate event completed');
}
