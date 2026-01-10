import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';
import { prisma } from '../../prisma/index.js';

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
  const inputMember = interaction.options.getUser('member');
  const inputAmount = interaction.options.getInteger('amount');

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.level.guild_only'));
  }

  if (!inputMember) {
    return await interaction.reply({
      content: i18n('commands.level.missing_member'),
      ephemeral: true,
    });
  }

  switch (subcommand) {
    case 'set': {
      if (!inputAmount && inputAmount !== 0) {
        return await interaction.reply({
          content: i18n('commands.level.missing_amount'),
          ephemeral: true,
        });
      }

      try {
        // Find or create user record
        let user = await prisma.user.findUnique({
          where: { userId: inputMember.id }
        });

        if (!user) {
          user = await prisma.user.create({
            data: { userId: inputMember.id }
          });
        }

        // Update or create level record
        await prisma.leveling.upsert({
          where: { userId: inputMember.id },
          update: { level: inputAmount },
          create: {
            userId: inputMember.id,
            level: inputAmount,
            exp: 0,
          }
        });

        const embed = new EmbedBuilder()
          .setColor('Green')
          .setTitle(i18n('commands.level.set_title'))
          .setDescription(i18n('commands.level.set_description')
            .replace('%s1', inputMember.toString())
            .replace('%s2', inputAmount.toString()))
          .setThumbnail(inputMember.displayAvatarURL())
          .setTimestamp();

        return await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Level set error:', error);
        return await interaction.reply({
          content: i18n('commands.level.set_error'),
          ephemeral: true,
        });
      }
    }
    case 'delete': {
      try {
        // Find user record
        const user = await prisma.user.findUnique({
          where: { userId: inputMember.id }
        });

        if (!user) {
          return await interaction.reply({
            content: i18n('commands.level.user_not_found'),
            ephemeral: true,
          });
        }

        // Delete level record
        await prisma.leveling.delete({
          where: { userId: inputMember.id }
        });

        const embed = new EmbedBuilder()
          .setColor('Red')
          .setTitle(i18n('commands.level.delete_title'))
          .setDescription(i18n('commands.level.delete_description')
            .replace('%s', inputMember.toString()))
          .setThumbnail(inputMember.displayAvatarURL())
          .setTimestamp();

        return await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Level delete error:', error);
        return await interaction.reply({
          content: i18n('commands.level.delete_error'),
          ephemeral: true,
        });
      }
    }
  }
}
