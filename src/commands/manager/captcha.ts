import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('captcha')
  .setDescription('Setup captcha verification system.')
  .setDescriptionLocalizations({
    th: 'ตั้งค่าระบบตรวจสอบ captcha',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('setup')
      .setDescription('Set up Captcha system')
      .setDescriptionLocalizations({ th: 'ตั้งค่าระบบ Captcha' })
      .addRoleOption((option) =>
        option
          .setName('role')
          .setDescription('Role or rank when confirmed.')
          .setDescriptionLocalizations({
            th: 'บทบาทหรือยศเมืออผ่านการยืนยัน',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('captcha')
          .setDescription('The name you want captcha to generate.')
          .setDescriptionLocalizations({
            th: 'ชื่อที่คุณต้องการให้ captcha สร้างขึ้นมา',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('enable')
      .setDescription('Enable the captcha system.')
      .setDescriptionLocalizations({ th: 'เปิดใช้งานระบบ captcha' }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('disable')
      .setDescription('Disable the captcha system.')
      .setDescriptionLocalizations({ th: 'ปิดใช้งานระบบ captcha' }),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ModerateMembers,
];
export const category = 'manager';

// Simple in-memory storage for captcha settings
const captchaStorage = new Map<
  string,
  { enable: boolean; roleId: string; captchaName: string }
>();

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputRole = interaction.options.getRole('role')!;
  const inputCaptcha = interaction.options.getString('captcha')!;

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.captcha.guild_only'));
  }

  const guildId = interaction.guild.id;

  switch (subcommand) {
    case 'setup': {
      captchaStorage.set(guildId, {
        enable: true,
        roleId: inputRole.id,
        captchaName: inputCaptcha,
      });

      await interaction.reply(i18n('commands.captcha.captcha_setup_success'));
      break;
    }
    case 'enable': {
      const currentCaptcha = captchaStorage.get(guildId);
      if (!currentCaptcha) {
        return await interaction.reply(
          i18n('commands.captcha.need_to_setup_before'),
        );
      }
      if (currentCaptcha.enable) {
        return await interaction.reply(
          i18n('commands.captcha.currently_enable'),
        );
      }

      captchaStorage.set(guildId, { ...currentCaptcha, enable: true });
      await interaction.reply(i18n('commands.captcha.enabled_captcha'));
      break;
    }
    case 'disable': {
      const currentCaptcha = captchaStorage.get(guildId);
      if (!currentCaptcha) {
        return await interaction.reply(
          i18n('commands.captcha.need_to_setup_before'),
        );
      }
      if (!currentCaptcha.enable) {
        return await interaction.reply(
          i18n('commands.captcha.currently_disable'),
        );
      }

      captchaStorage.set(guildId, { ...currentCaptcha, enable: false });
      await interaction.reply(i18n('commands.captcha.disabled_captcha'));
      break;
    }
  }
}
