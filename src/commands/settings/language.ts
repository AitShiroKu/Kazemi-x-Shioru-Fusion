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
  .setName('language')
  .setDescription('Set language to use in guild.')
  .setDescriptionLocalizations({ th: 'ตั้งค่าภาษาสำหรับบอท' })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('get')
      .setDescription('See the language that is currently being used.')
      .setDescriptionLocalizations({
        th: 'ดูภาษาที่ใช้อยู่ในปัจจุบัน',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('Explore supported languages')
      .setDescriptionLocalizations({
        th: 'สำรวจภาษาที่รองรับ',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('set')
      .setDescription('Set language in case of manual setting for CUSTOM type.')
      .setDescriptionLocalizations({
        th: 'ตั้งค่าภาษากรณีตั้งค่าด้วยตัวเองสำหรับประเภท',
      })
      .addStringOption((option) =>
        option
          .setName('locale')
          .setDescription('Language locale code (e.g. en-US)')
          .setDescriptionLocalizations({
            th: 'รหัสภาษา (เช่น en-US)',
          })
          .setRequired(true),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('by')
      .setDescription('Refer to language settings by type.')
      .setDescriptionLocalizations({
        th: 'อ้างอิงการตั้งค่าภาษาตามประเภท',
      })
      .addStringOption((option) =>
        option
          .setName('type')
          .setDescription('Type of language setting')
          .setDescriptionLocalizations({
            th: 'ประเภทของการตั้งค่าภาษา',
          })
          .setChoices(
            {
              name: 'CUSTOM',
              name_localizations: { th: 'กำหนดเอง' },
              value: 'CUSTOM',
            },
            {
              name: 'USER',
              name_localizations: { th: 'ผู้ใช้' },
              value: 'USER',
            },
            {
              name: 'GUILD',
              name_localizations: { th: 'กิลด์' },
              value: 'GUILD',
            },
          )
          .setRequired(true),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'settings';

export async function execute(interaction: ChatInputCommandInteraction) {
  const unavailableEmbed = new EmbedBuilder()
    .setTitle('⚠️ Feature Unavailable')
    .setDescription('The language setting system is currently unavailable as the database integration has been removed.')
    .setColor(Colors.Yellow)
    .setTimestamp();

  await interaction.reply({ embeds: [unavailableEmbed], ephemeral: true });
}
