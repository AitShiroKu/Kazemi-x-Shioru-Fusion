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
  .setName('level')
  .setDescription('Manage levels within server.')
  .setDescriptionLocalizations({
    th: 'จัดการเลเวลภายในเซิร์ฟเวอร์',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('set')
      .setDescription('Set Level of Members')
      .setDescriptionLocalizations({
        th: 'ตั้งค่าเลเวลของสมาชิก',
      })
      .addUserOption((option) =>
        option
          .setName('member')
          .setDescription(
            'The name of member who wants to set level value.',
          )
          .setDescriptionLocalizations({
            th: 'ชื่อของสมาชิกที่ต้องการกำหนดค่าเลเวล',
          })
          .setRequired(true),
      )
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('The amount of level that you want to set.')
          .setDescriptionLocalizations({
            th: 'จำนวนเลเวลที่คุณต้องการตั้งค่า',
          })
          .setRequired(true)
          .setMinValue(0),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('delete')
      .setDescription('Removing EXP and Level of members')
      .setDescriptionLocalizations({
        th: 'ลบ exp และเลเวลของสมาชิก',
      })
      .addUserOption((option) =>
        option
          .setName('member')
          .setDescription('Members you want to delete levels.')
          .setDescriptionLocalizations({
            th: 'สมาชิกที่คุณต้องการลบระดับ',
          })
          .setRequired(true),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.level.guild_only'));
  }

  switch (subcommand) {
    case 'set':
      await interaction.reply({
        content: i18n('commands.level.not_implemented'),
        ephemeral: true,
      });
      break;
    case 'delete':
      await interaction.reply({
        content: i18n('commands.level.not_implemented'),
        ephemeral: true,
      });
      break;
  }
}
