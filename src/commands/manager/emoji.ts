import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('emoji')
  .setDescription('Manage this server emojis.')
  .setDescriptionLocalizations({
    th: 'จัดการอีโมจิของเซิร์ฟเวอร์นี้',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
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
      .setName('add')
      .setDescription('Add emojis on this server.')
      .setDescriptionLocalizations({
        th: 'เพิ่มอีโมจิบนเซิร์ฟเวอร์นี้',
      })
      .addAttachmentOption((option) =>
        option
          .setName('emoji')
          .setDescription('Emoji images.')
          .setDescriptionLocalizations({
            th: 'ภาพของอีโมจิ',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('The name of the emoji.')
          .setDescriptionLocalizations({
            th: 'ชื่อของอีโมจิ',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('Reason for creation.')
          .setDescriptionLocalizations({
            th: 'เหตุผลของการเพิ่ม',
          })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('delete')
      .setDescription('Remove emojis on this server.')
      .setDescriptionLocalizations({
        th: 'ลบอีโมจิบนเซิร์ฟเวอร์นี้',
      })
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('Emoji ID.')
          .setDescriptionLocalizations({
            th: 'รหัสของอีโมจิ',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('Reason for deletion.')
          .setDescriptionLocalizations({
            th: 'เหตุผลของการลบ',
          })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('List all emojis on this server.')
      .setDescriptionLocalizations({
        th: 'แสดงรายการอีโมจิทั้งหมด',
      }),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageGuildExpressions,
];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.emoji.guild_only'));
  }

  switch (subcommand) {
    case 'add':
      await interaction.reply({
        content: i18n('commands.emoji.not_implemented'),
        ephemeral: true,
      });
      break;
    case 'delete':
      await interaction.reply({
        content: i18n('commands.emoji.not_implemented'),
        ephemeral: true,
      });
      break;
    case 'list':
      await interaction.reply({
        content: i18n('commands.emoji.not_implemented'),
        ephemeral: true,
      });
      break;
  }
}
