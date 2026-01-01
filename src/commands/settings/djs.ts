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
  .setName('djs')
  .setDescription('Set who has permission to control music')
  .setDescriptionLocalizations({ th: 'ตั้งค่าผู้ที่มีสิทธิ์ในการควบคุมเพลง' })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('get')
      .setDescription('View currently available information about music control rights.')
      .setDescriptionLocalizations({
        th: 'ดูข้อมูลที่มีอยู่ในตอนนี้เกี่ยวกับสิทธิ์ในการควบคุมเพลง',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('enable')
      .setDescription('Enable who has music control permissions')
      .setDescriptionLocalizations({
        th: 'เปิดใช้งานผู้ที่มีสิทธิ์ควบคุมเพลง',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('disable')
      .setDescription('Disable who has music control permissions')
      .setDescriptionLocalizations({
        th: 'ปิดใช้งานผู้ที่มีสิทธิ์ควบคุมเพลง',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('only')
      .setDescription('Can it only be used by people who have permission to control music?')
      .setDescriptionLocalizations({
        th: 'สามารถใช้งานได้เฉพาะผู้ที่มีสิทธิ์ในการควบคุมเพลงหรือไม่',
      })
      .addBooleanOption((option) =>
        option
          .setName('set')
          .setDescription(
            'If true, only music supervisor will be able to change or control music.',
          )
          .setDescriptionLocalizations({
            th: 'หากเป็นจริง จะมีเพียงผู้ควบคุมเพลงเท่านั้นที่จะสามารถเปลี่ยนแปลงหรือควบคุมเพลงได้',
          }),
      ),
  )
  .addSubcommandGroup((subcommandGroup) =>
    subcommandGroup
      .setName('roles')
      .setDescription('Manage available music supervisor roles')
      .setDescriptionLocalizations({
        th: 'จัดการบทบาทของผู้ควบคุมเพลงที่สามารถใช้งานได้',
      })
      .addSubcommand((subcommand) =>
        subcommand
          .setName('add')
          .setDescription('Added role of Music Conductor')
          .setDescriptionLocalizations({ th: 'เพิ่มบทบาทของผู้ควบคุมเพลง' })
          .addRoleOption((option) =>
            option
              .setName('name')
              .setDescription('Name of required role')
              .setDescriptionLocalizations({ th: 'ชื่อของบทบาที่ต้องการ' }),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('remove')
          .setDescription('Name of required role')
          .setDescriptionLocalizations({ th: 'ลบบทบาทของผู้ควบคุมเพลง' })
          .addRoleOption((option) =>
            option
              .setName('name')
              .setDescription('Name of required role')
              .setDescriptionLocalizations({ th: 'ชื่อของบทบาที่ต้องการ' }),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('clear')
          .setDescription('Clear all Music Controller roles.')
          .setDescriptionLocalizations({
            th: 'ล้างบทบาททั้งหมดของผู้ควบคุมเพลง',
          }),
      ),
  )
  .addSubcommandGroup((subcommandGroup) =>
    subcommandGroup
      .setName('users')
      .setDescription('Manage who has control over which songs are available.')
      .setDescriptionLocalizations({
        th: 'จัดการผู้ที่มีสิทธิ์ควบคุมเพลงที่สามารถใช้งานได้',
      })
      .addSubcommand((subcommand) =>
        subcommand
          .setName('add')
          .setDescription('Add users who can have permission to control music.')
          .setDescriptionLocalizations({
            th: 'เพิ่มผู้ใช้ที่สามารถมีสิทธิ์ในการควบคุมเพลง',
          })
          .addUserOption((option) =>
            option
              .setName('name')
              .setDescription('Name of desired user')
              .setDescriptionLocalizations({ th: 'ชื่อของผู้ใช้ที่ต้องการ' }),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('remove')
          .setDescription('Delete who has permission to control music')
          .setDescriptionLocalizations({ th: 'ลบผู้ที่มีสิทธิ์ในการควบคุมเพลง' })
          .addUserOption((option) =>
            option
              .setName('name')
              .setDescription('Name of desired user')
              .setDescriptionLocalizations({ th: 'ชื่อของผู้ใช้ที่ต้องการ' }),
          ),
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName('clear')
          .setDescription('Clear all those who can control music.')
          .setDescriptionLocalizations({
            th: 'ล้างผู้ที่สามารถควบคุมเพลงได้ทั้งหมด',
          }),
      ),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageGuild,
];
export const category = 'settings';

export async function execute(interaction: ChatInputCommandInteraction) {
  const unavailableEmbed = new EmbedBuilder()
    .setTitle('⚠️ Feature Unavailable')
    .setDescription('The DJ permissions system is currently unavailable as the database integration has been removed.')
    .setColor(Colors.Yellow)
    .setTimestamp();

  await interaction.reply({ embeds: [unavailableEmbed], ephemeral: true });
}
