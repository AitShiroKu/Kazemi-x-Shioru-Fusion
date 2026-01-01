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
  .setName('user')
  .setDescription('Get your user information.')
  .setDescriptionLocalizations({ th: 'รับข้อมูลผู้ใช้ของคุณ' })
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
      .setName('list')
      .setDescription('See types of data currently available.')
      .setDescriptionLocalizations({
        th: 'ดูประเภทของข้อมูลที่พร้อมใช้งานในขณะนี้',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('get')
      .setDescription('Get information of user you want to explore.')
      .setDescriptionLocalizations({
        th: 'รับข้อมูลของผู้ใช้ที่ต้องการจะสำรวจ',
      })
      .addStringOption((option) =>
        option
          .setName('about')
          .setDescription('Information you want to know, such as avatarURL')
          .setDescriptionLocalizations({
            th: 'ข้อมูลที่คุณต้องการจะทราบ เช่น avatarURL',
          })
          .setRequired(true),
      )
      .addUserOption((option) =>
        option
          .setName('member')
          .setDescription('Information of other members you wish to see.')
          .setDescriptionLocalizations({
            th: 'ข้อมูลของสมาชิกคนอื่นๆ ที่คุณต้องการดู',
          }),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'information';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputAbout = interaction.options.getString('about') ?? '';
  const inputMember = interaction.options.getMember('member');

  const user = inputMember ? (inputMember as any).user : interaction.user;
  const i18n = (interaction.client as any).i18n;

  const userProperties: Record<string, string> = {
    accentColor:
      (user as any).accentColor?.toString() || i18n.t('commands.user.none'),
    avatar: user.avatar || i18n.t('commands.user.unknown'),
    avatarURL:
      user.avatarURL() || i18n.t('commands.user.unknown'),
    avatarDecoration:
      (user as any).avatarDecoration || i18n.t('commands.user.unknown'),
    avatarDecorationURL:
      (user as any).avatarDecorationURL() || i18n.t('commands.user.unknown'),
    banner: user.banner || i18n.t('commands.user.unknown'),
    bannerURL:
      user.bannerURL() || i18n.t('commands.user.unknown'),
    bot:
      (user.bot
        ? i18n.t('commands.user.yes')
        : i18n.t('commands.user.no')) || i18n.t('commands.user.unknown'),
    createAt:
      user.createdAt?.toLocaleString(interaction.locale) ||
      i18n.t('commands.user.unknown'),
    createdTimestamp:
      (user as any).createdTimestamp?.toString() || i18n.t('commands.user.unknown'),
    defaultAvatarURL:
      (user as any).defaultAvatarURL || i18n.t('commands.user.unknown'),
    discriminator:
      user.discriminator || i18n.t('commands.user.none'),
    displayAvatarURL:
      user.displayAvatarURL() || i18n.t('commands.user.none'),
    displayName:
      user.displayName || i18n.t('commands.user.unknown'),
    flags:
      user.flags?.toArray().join(', ') || i18n.t('commands.user.none'),
    globalName:
      user.displayName || i18n.t('commands.user.unknown'),
    hexAccentColor:
      (user as any).hexAccentColor || i18n.t('commands.user.none'),
    id: user.id || i18n.t('commands.user.unknown'),
    partial: user.partial
      ? i18n.t('commands.user.yes')
      : i18n.t('commands.user.no') || i18n.t('commands.user.unknown'),
    system: user.system
      ? i18n.t('commands.user.yes')
      : i18n.t('commands.user.no') || i18n.t('commands.user.unknown'),
    tag: user.tag || i18n.t('commands.user.none'),
    username:
      user.username || i18n.t('commands.user.unknown'),
  };

  const propertiesKeys = Object.keys(userProperties);
  const propertiesData = Object.fromEntries(
    Object.entries(userProperties).map(([key, value]) => [
      key.toLowerCase(),
      value,
    ]),
  );
  const propertiesName =
    propertiesKeys[
      propertiesKeys.findIndex((key) =>
        key.toLowerCase().includes(inputAbout.toLowerCase()),
      )
    ];
  const propertiesType = propertiesKeys.map((type) => type.toLowerCase());

  switch (subcommand) {
    case 'list': {
      await interaction.reply(
        i18n.t('commands.user.available_type_list', {
          list: propertiesKeys.join(', '),
        }),
      );
      break;
    }
    case 'get': {
      if (!propertiesType.includes(inputAbout.toLowerCase()))
        return interaction.reply(i18n.t('commands.user.invalid_type'));

      const clientUsername = interaction.client.user.username;
      const clientAvatarURL = interaction.client.user.avatarURL();
      const userEmbed = new EmbedBuilder()
        .setTitle(i18n.t('commands.user.user_info'))
        .setDescription(i18n.t('commands.user.user_info_description'))
        .setColor(parseInt(userProperties.accentColor) || Colors.Aqua)
        .setTimestamp()
        .setFooter({
          text: i18n.t('commands.user.info_date'),
          iconURL: userProperties.avatarURL || '',
        })
        .setThumbnail(userProperties.avatarURL || '')
        .setAuthor({ name: clientUsername, iconURL: clientAvatarURL || '' });

      userEmbed.addFields({
        name: propertiesName,
        value: propertiesData[inputAbout.toLowerCase()],
        inline: true,
      });

      await interaction.reply({ embeds: [userEmbed] });
      break;
    }
  }
}
