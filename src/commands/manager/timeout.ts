import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('timeout')
  .setDescription('Set a time limit for members before they leave guild.')
  .setDescriptionLocalizations({
    th: 'กำหนดเวลาให้สมาชิกก่อนออกจากกิลด์',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('add')
      .setDescription('Set a timeout for user.')
      .setDescriptionLocalizations({
        th: 'ตั้งให้ผู้ใช้หมดเวลา',
      })
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('Users who want to set a timeout.')
          .setDescriptionLocalizations({
            th: 'ผู้ใช้ที่ต้องการตั้งให้หมดเวลา',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('duration')
          .setDescription('The length of time user will be kicked out.')
          .setDescriptionLocalizations({
            th: 'ระยะเวลาที่ผู้ใช้จะถูกเตะออก',
          })
          .setRequired(true)
          .addChoices(
            { name: '60 Seconds', value: '60' },
            { name: '2 Minutes', value: '120' },
            { name: '5 Minutes', value: '300' },
            { name: '10 Minutes', value: '600' },
            { name: '15 Minutes', value: '900' },
            { name: '20 Minutes', value: '1200' },
            { name: '30 Minutes', value: '1800' },
            { name: '45 Minutes', value: '2700' },
            { name: '1 Hour', value: '3600' },
            { name: '2 Hours', value: '7200' },
            { name: '3 Hours', value: '10800' },
            { name: '5 Hours', value: '18000' },
            { name: '10 Hours', value: '36000' },
            { name: '1 Day', value: '86400' },
            { name: '2 Days', value: '172800' },
            { name: '3 Days', value: '259200' },
            { name: '5 Days', value: '432000' },
            { name: '1 Week', value: '604800' },
          ),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('The reason user was set to time out.')
          .setDescriptionLocalizations({
            th: 'เหตุผลที่ตั้งให้ผู้ใช้หมดเวลา',
          }),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Set a untimeout for user.')
      .setDescriptionLocalizations({
        th: 'ตั้งให้ผู้ใช้ไม่หมดเวลา',
      })
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('Users who want to set a untimeout.')
          .setDescriptionLocalizations({
            th: 'ผู้ใช้ที่ต้องการตั้งให้ไม่หมดเวลา',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('The reason user was set to untimeout.')
          .setDescriptionLocalizations({
            th: 'เหตุผลที่ตั้งให้ผู้ใช้ไม่หมดเวลา',
          }),
      ),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ModerateMembers,
];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.timeout.guild_only'));
  }

  switch (subcommand) {
    case 'add':
      await interaction.reply({
        content: i18n('commands.timeout.not_implemented'),
        ephemeral: true,
      });
      break;
    case 'remove':
      await interaction.reply({
        content: i18n('commands.timeout.not_implemented'),
        ephemeral: true,
      });
      break;
  }
}
