/**
 * Logs Command
 * Manage log files to check functionality or fix bugs
 * Converted from Shioru/source/commands/developer/logs.js
 */

import {
  SlashCommandBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { join } from 'node:path';
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import type { Command, CommandCategory } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('logs')
  .setDescription('Manage log files to check functionality or fix bugs.')
  .setDescriptionLocalizations({
    th: 'จัดการไฟล์เอกสารบันทึกเพื่อตรวจสอบการทำงานหรือแก้ไขข้อบกพร่อง',
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
  .addSubcommand((subcommand) =>
    subcommand
      .setName('get')
      .setDescription('Download work memorandum files')
      .setDescriptionLocalizations({
        th: 'ดาวน์โหลดไฟล์เอกสารบันทึกเกี่ยวกับการทำงาน',
      })
      .addStringOption((option) =>
        option
          .setName('type')
          .setDescription('Type of document file')
          .setDescriptionLocalizations({ th: 'ประเภทของไฟล์เอกสารบันทึก' })
          .setRequired(true)
          .setChoices(
            { name: 'app', value: 'app.log' },
            { name: 'debug', value: 'debug.json.log' },
            { name: 'error', value: 'error.json.log' },
            { name: 'fetal', value: 'fetal.json.log' },
            { name: 'info', value: 'info.json.log' },
            { name: 'trace', value: 'trace.json.log' },
            { name: 'warn', value: 'warn.json.log' },
          ),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('delete')
      .setDescription('Remove unwanted log files from folder.')
      .setDescriptionLocalizations({
        th: 'ลบไฟล์ล็อกที่ไม่ต้องการออกจากโฟลเดอร์',
      })
      .addStringOption((option) =>
        option
          .setName('type')
          .setDescription('Type of document file')
          .setDescriptionLocalizations({ th: 'ประเภทของไฟล์เอกสารบันทึก' })
          .setRequired(true)
          .setChoices(
            { name: 'app', value: 'app.log' },
            { name: 'debug', value: 'debug.json.log' },
            { name: 'error', value: 'error.json.log' },
            { name: 'fetal', value: 'fetal.json.log' },
            { name: 'info', value: 'info.json.log' },
            { name: 'trace', value: 'trace.json.log' },
            { name: 'warn', value: 'warn.json.log' },
          ),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'developer';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputType = interaction.options.getString('type');

  if (!inputType) {
    return await interaction.reply({
      content: 'Type parameter is required',
      ephemeral: true,
    });
  }

  const directory = join('logs');
  const file = join(directory, inputType);
  const teamOwner = (interaction.client as any).configs.team?.owner;
  const teamDev = (interaction.client as any).configs.team?.developer || [];

  if (!existsSync(directory)) {
    return await interaction.reply({
      content: (interaction.client as any).i18n.t('commands.logs.empty_directory'),
      ephemeral: true,
    });
  }
  if (!existsSync(file)) {
    return await interaction.reply({
      content: (interaction.client as any).i18n.t('commands.logs.file_missing'),
      ephemeral: true,
    });
  }

  switch (subcommand) {
    case 'get': {
      const attachment = new AttachmentBuilder(file, {
        name: inputType,
        description: (interaction.client as any).i18n.t(
          'commands.logs.attachment_description',
        ),
      });
      const fileContent = readFileSync(file, { encoding: 'utf-8' });

      if (fileContent.length <= 1) {
        await interaction.reply({
          content: (interaction.client as any).i18n.t('commands.logs.empty_content'),
          ephemeral: true,
        });
        return;
      }

      await interaction.reply({
        content: (interaction.client as any).i18n.t('commands.logs.found_file'),
        files: [attachment],
        ephemeral: true,
      });
      break;
    }
    case 'delete': {
      if (
        interaction.user.id !== teamOwner &&
        !teamDev.includes(interaction.user.id)
      ) {
        await interaction.reply({
          content: (interaction.client as any).i18n.t(
            'commands.logs.only_owner_and_developers',
          ),
          ephemeral: true,
        });
        return;
      }

      unlinkSync(file);
      await interaction.reply({
        content: (interaction.client as any).i18n.t('commands.logs.file_has_been_deleted'),
        ephemeral: true,
      });
      break;
    }
  }
}

export default { data, execute, permissions, category };
