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
  const client = interaction.client as any;
  const subcommand = interaction.options.getSubcommand();
  const subcommandGroup = interaction.options.getSubcommandGroup();
  const inputSet = interaction.options.getBoolean('set') ?? false;
  const inputRolesName: any = interaction.options.getRole('name');
  const inputUsersName: any = interaction.options.getUser('name');

  const db = client.database;
  const djsRef = db.ref(`guilds/${interaction.guildId}/djs`);
  const djsSnapshot = await djsRef.get();

  const configs = client.configs.djs || { enable: true, only: false, roles: [], users: [] };

  switch (subcommand) {
    case 'get':
      const noInputEmbed = new EmbedBuilder()
        .setTitle('Music DJ Permissions')
        .setDescription([
          `</${interaction.commandId}: ${interaction.commandName}>`,
          'Manage music like DJ',
        ].join('\n\n'))
        .setColor(Colors.Blue)
        .setTimestamp();

      await interaction.reply({ embeds: [noInputEmbed] });
      break;
    case 'enable':
      if (configs.enable)
        return await interaction.reply('DJ mode is currently enabled.');

      configs.enable = true;
      await djsRef.set({ ...configs, toggledAt: new Date() });

      await interaction.reply('Enabled DJ mode.');
      break;
    case 'disable':
      if (!configs.enable)
        return await interaction.reply('DJ mode is currently disabled.');

      configs.enable = false;
      await djsRef.set({ ...configs, toggledAt: new Date() });

      await interaction.reply('Disabled DJ mode.');
      break;
    case 'only':
      if (configs.only === inputSet)
        return await interaction.reply(
          `DJ only mode is currently ${inputSet ? 'enabled' : 'disabled'}.`,
        );

      configs.only = inputSet;
      await djsRef.set({ ...configs, editedAt: new Date() });

      await interaction.reply(
        inputSet
          ? 'Only DJ can manage music.'
          : 'Everyone can manage music.',
      );
      break;
  }

  switch (subcommandGroup) {
    case 'roles':
      switch (subcommand) {
        case 'add':
          if (configs.roles.includes(inputRolesName.id))
            return await interaction.reply('Role has been added before.');

          configs.roles.push(inputRolesName.id);
          await djsRef.set({
            ...configs,
            editedAt: new Date(),
            roles: configs.roles,
          });

          await interaction.reply(`Added role: ${inputRolesName.name}`);
          break;
        case 'remove':
          if (!configs.roles.includes(inputRolesName.id))
            return await interaction.reply(
              'Role is currently not in the list.',
            );

          if (configs.roles.indexOf(inputRolesName.id) < 0) {
            return await interaction.reply('Role not found in list.');
          }

          configs.roles.splice(configs.roles.indexOf(inputRolesName.id), 1);
          await djsRef.set({
            ...configs,
            editedAt: new Date(),
            roles: configs.roles,
          });

          await interaction.reply(`Deleted role: ${inputRolesName.id}`);
          break;
        case 'clear':
          if (!configs.roles.length)
            return await interaction.reply('No roles in list.');

          configs.roles = [];
          await djsRef.set({
            ...configs,
            editedAt: new Date(),
            roles: configs.roles,
          });

          if (djsSnapshot.exists()) {
            const guildData = djsSnapshot.val();

            if (!guildData.roles.length && !guildData.users.length) {
              configs.enable = false;
              await djsRef.set({ ...configs, enable: false });
            }
          }

          await interaction.reply('Cleared roles in list.');
          break;
      }
      break;
    case 'users':
      switch (subcommand) {
        case 'add':
          if (configs.users.includes(inputUsersName.id))
            return await interaction.reply('User currently can manage music.');

          configs.users.push(inputUsersName.id);
          await djsRef.set({
            ...configs,
            editedAt: new Date(),
            users: configs.users,
          });

          await interaction.reply(`Added user: ${inputUsersName.id}`);
          break;
        case 'remove':
          if (!configs.users.includes(inputUsersName.id))
            return await interaction.reply('User has not been added before.');

          if (configs.users.indexOf(inputUsersName.id) < 0) {
            return await interaction.reply('User not found in list.');
          }

          configs.users.splice(configs.users.indexOf(inputUsersName.id), 1);
          await djsRef.set({
            ...configs,
            editedAt: new Date(),
            users: configs.users,
          });

          await interaction.reply(`Deleted user: ${inputUsersName.id}`);
          break;
        case 'clear':
          if (!configs.users.length)
            return await interaction.reply('No users in list.');

          configs.users = [];
          await djsRef.set({
            ...configs,
            editedAt: new Date(),
            users: configs.users,
          });

          if (djsSnapshot.exists()) {
            const guildData = djsSnapshot.val();

            if (!guildData.users.length && !guildData.roles.length) {
              configs.enable = false;
              await djsRef.set({ ...configs, enable: false });
            }
          }

          await interaction.reply('Cleared users in list.');
          break;
      }
      break;
  }
}
