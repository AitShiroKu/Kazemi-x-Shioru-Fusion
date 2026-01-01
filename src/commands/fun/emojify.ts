/**
 * Emojify Command
 * Convert text to emoji text
 * Converted from Shioru/source/commands/fun/emojify.js
 */

import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('emojify')
  .setDescription('Convert text to emoji text')
  .setDescriptionLocalizations({
    th: 'แปลงข้อความเป็นข้อความอีโมจิ',
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
      .setName('text')
      .setDescription('The text you want to convert to emoji text.')
      .setDescriptionLocalizations({
        th: 'ข้อความที่ต้องการแปลงเป็นข้อความอีโมจิ',
      })
      .setMaxLength(2000)
      .setMinLength(1)
      .setRequired(true),
  )
  .addBooleanOption((option) =>
    option
      .setName('hidden')
      .setDescription('Want to hide emoji text?')
      .setDescriptionLocalizations({ th: 'ต้องการซ่อนข้อความอีโมจิหรือไม่' }),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputText = interaction.options.getString('text');
  const inputHidden = interaction.options.getBoolean('hidden');

  try {
    const emojiText = (inputText || '')
        .toLowerCase()
        .split('')
        .map((letter) => {
          if (letter === ' ') {
            return ` :regional_indicator_${letter}:`;
          }
          return letter;
        })
        .join('');

    await interaction.reply({ content: emojiText, ephemeral: inputHidden ?? false });
  } catch (error) {
    await interaction.reply({
        content: (interaction.client as any).i18n.t('commands.emojify.can_not_convert'),
        ephemeral: inputHidden ?? false,
      });
  }
}

export default { data, execute, permissions, category };
