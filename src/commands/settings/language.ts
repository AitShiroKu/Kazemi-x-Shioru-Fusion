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
  const client = interaction.client as any;
  const subcommand = interaction.options.getSubcommand();
  const inputLocale = interaction.options.getString('locale');
  const inputType = interaction.options.getString('type');

  const i18n = client.i18n;
  const db = client.database;
  const guildRef = db.ref(`guilds/${interaction.guildId}/language`);
  const guildSnapshot = await guildRef.get();
  const guildVal = guildSnapshot.val() || { type: 'CUSTOM', locale: 'en-US' };

  const locales = i18n.options.preload || ['en-US', 'th'];

  switch (subcommand) {
    case 'get':
      const getEmbed = new EmbedBuilder()
        .setTitle('Language Settings')
        .setDescription([
          `</${interaction.commandId}: ${interaction.commandName}>`,
          `Current language: ${guildVal.locale}`,
          `Type: ${guildVal.type}`,
        ].join('\n\n'))
        .setColor(Colors.Blue)
        .setTimestamp();

      await interaction.reply({ embeds: [getEmbed] });
      break;
    case 'list':
      const listEmbed = new EmbedBuilder()
        .setTitle('Supported Languages')
        .setDescription(`Available languages:\n${locales.join(', ')}`)
        .setColor(Colors.Blue)
        .setTimestamp()
        .setFooter({
          text: 'Use /language set to change language',
        });

      await interaction.reply({ embeds: [listEmbed] });
      break;
    case 'set':
      if (!locales.includes(inputLocale))
        return await interaction.reply(
          `Language '${inputLocale}' not found. Available: ${locales.join(', ')}`,
        );

      if (inputLocale === i18n.language)
        return await interaction.reply(
          `Language '${inputLocale}' is already set.`,
        );

      await guildRef.set({ ...guildVal, locale: inputLocale });
      await i18n.changeLanguage(inputLocale);

      await interaction.reply(`Changed language to: ${inputLocale}`);
      break;
    case 'by':
      await guildRef.set({ ...guildVal, type: inputType });

      let targetLocale: string = guildVal.locale;
      if (inputType === 'USER') targetLocale = interaction.locale;

      await i18n.changeLanguage(targetLocale);

      await interaction.reply(
        `Changed language type to: ${inputType} (using: ${targetLocale})`,
      );
      break;
  }
}
