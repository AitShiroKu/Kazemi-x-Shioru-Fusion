import {
  Events,
  Collection,
  ChatInputCommandInteraction,
  AutocompleteInteraction,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(client: any, interaction: any) {
  if (interaction.user.bot) return;

  client.logger.debug(`Received interaction: ${interaction.id} (Type: ${interaction.type})`);

  // 1. Handle Autocomplete separately (no reply/deferReply available)
  if (interaction.isAutocomplete()) {
    const commandName = interaction.commandName;
    const command = client.commands.get(commandName);

    if (!command) {
      client.logger.warn(`No autocomplete matching ${commandName} was found.`);
      return;
    }

    try {
      await command.autocomplete(interaction);
    } catch (error) {
      client.logger.error(error, `Error in autocomplete for ${commandName}`);
    }
    return;
  }

  // 2. Handle Replies for Chat Input and Context Menu Commands
  client.logger.debug('[DEBUG] Starting interaction processing');
  
  try {

    // Handle chat input commands
    if (interaction.isChatInputCommand()) {
      const commandName = interaction.commandName;
      client.logger.debug(`[DEBUG] Processing chat input command: ${commandName}`);
      
      const command = client.commands.get(commandName);

      if (!command) {
        client.logger.warn(`No command matching ${commandName} was found.`);
        return;
      }

      client.logger.debug(`Executing command: ${commandName}`);

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
          client.logger.debug('[DEBUG] Sending cooldown response');
          await interaction.reply({
            content: client.i18n.t('events.interactionCreate.command_has_cooldown', {
              command_name: commandName,
              expired_timestamp: expiredTimestamp,
            }),
            ephemeral: true,
          });
          return;
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

      // Check permissions
      if (command.permissions) {
        const member = interaction.member as any;
        if (!member.permissions.has(command.permissions)) {
          client.logger.debug('[DEBUG] Sending permission denied response');
          return interaction.reply({
            content: client.i18n.t('events.interactionCreate.client_is_not_allowed', {
              permissions: command.permissions.toArray(),
            }),
            ephemeral: true,
          });
        }
      }

      try {
        client.logger.debug(`[DEBUG] About to execute command: ${commandName}`);
        await command.execute(interaction);
        client.logger.debug(`[DEBUG] Command executed successfully: ${commandName}`);

      } catch (error) {
        client.logger.error(error, `Error executing command ${commandName}`);
        if (!interaction.replied && !interaction.deferred) {
          client.logger.debug('[DEBUG] Sending error reply (not replied/deferred)');
          await interaction.reply({
            content: client.i18n.t('events.interactionCreate.error_executing_command', {
              command_name: commandName,
            }),
            ephemeral: true,
          }).catch(() => { });
        } else {
          client.logger.debug('[DEBUG] Sending error followup (already replied/deferred)');
          await interaction.followUp({
            content: client.i18n.t('events.interactionCreate.error_executing_command', {
              command_name: commandName,
            }),
            ephemeral: true,
          }).catch(() => { });
        }
      }
    }

    // Handle context menu commands
    if (interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
      const contextName = interaction.commandName;
      const context = client.contexts.get(contextName);

      if (!context) {
        client.logger.warn(`No context matching ${contextName} was found.`);
        return;
      }

      try {
        await context.execute(interaction);
      } catch (error) {
        client.logger.error(error, `Error executing context ${contextName}`);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: client.i18n.t('events.interactionCreate.error_executing_command', {
              command_name: contextName,
            }),
            ephemeral: true,
          }).catch(() => { });
        } else {
          await interaction.followUp({
            content: client.i18n.t('events.interactionCreate.error_executing_command', {
              command_name: contextName,
            }),
            ephemeral: true,
          }).catch(() => { });
        }
      }
    }
  } catch (error) {
    client.logger.error(error, 'Critical error in interactionCreate handler');
    try {
      if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: '❌ An internal error occurred while processing this interaction.',
          ephemeral: true,
        });
      }
    } catch (replyError) {
      client.logger.error(replyError, 'Failed to send error reply');
    }
  }

  client.logger.debug('InteractionCreate event completed');
}
