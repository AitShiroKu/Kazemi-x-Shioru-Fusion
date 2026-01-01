/**
 * Impersonate Command
 * Send a message as if from another user via webhook
 * Converted from Shioru/source/commands/fun/impersonate.js
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
  .setName('impersonate')
  .setDescription('Send a message as if from another user via webhook.')
  .setDescriptionLocalizations({
    th: 'ส่งข้อความปลอมขึ้นมาตอบกลับ',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('Users who want to imitate.')
      .setDescriptionLocalizations({ th: 'ผู้ใช้ที่ต้องการจำลอง' })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('message')
      .setDescription('The message you want to emulate.')
      .setDescriptionLocalizations({ th: 'ข้อความที่ต้องการจำลอง' })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageWebhooks,
];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  const inputUser = interaction.options.getUser('user', true);
  const inputMessage = interaction.options.getString('message', true);

  if (!interaction.guild || !interaction.channel) {
    return await interaction.editReply(
      (interaction.client as any).i18n.t('commands.impersonate.member_not_found'),
    );
  }

  const member = await interaction.guild.members.fetch(inputUser.id);

  if (!member) {
    return await interaction.editReply(
      (interaction.client as any).i18n.t('commands.impersonate.member_not_found'),
    );
  }

  const impersonateWebhook = await (interaction.channel as any).createWebhook({
    name: inputUser.username,
    avatar: inputUser.displayAvatarURL(),
  });

  try {
    await (impersonateWebhook as any).send(inputMessage);
    await impersonateWebhook.delete();
    await interaction.editReply(
      (interaction.client as any).i18n.t('commands.impersonate.success').replace('%s', inputUser.id),
    );
  } catch (error) {
    await impersonateWebhook.delete();
    await interaction.editReply(
      (interaction.client as any).i18n.t('commands.impersonate.failed'),
    );
  }
}

export default { data, execute, permissions, category };
