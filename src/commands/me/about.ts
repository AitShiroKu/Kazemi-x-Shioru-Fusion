import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('about')
  .setDescription('View information about me.')
  .setDescriptionLocalizations({
    th: 'ดูข้อมูลเกี่ยวกับฉัน',
  })
  .setDefaultMemberPermissions(null)
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
      .setName('personal')
      .setDescription('View personal information about me')
      .setDescriptionLocalizations({
        th: 'ดูข้อมูลส่วนตัวเกี่ยวกับฉัน',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('license')
      .setDescription('Understanding copyrighted content')
      .setDescriptionLocalizations({
        th: 'ทำความเข้าใจกับเนื้อหาที่มีลิขสิทธิ์',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('stats')
      .setDescription('Check out my interesting stats.')
      .setDescriptionLocalizations({
        th: 'ตรวจดูข้อมูลสถิติที่น่าสนใจของฉัน',
      }),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'me';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  const clientUsername = interaction.client.user.username;
  const clientAvatar = interaction.client.user.displayAvatarURL();

  switch (subcommand) {
    case 'personal':
      const aboutPersonalEmbed = new EmbedBuilder()
        .setTitle(i18n('commands.about.my_personal'))
        .setDescription(
          i18n('commands.about.my_personal_detail', {
            name: clientUsername,
            website_link: 'https://github.com',
            pp_link: 'https://github.com/privacy',
            tos_link: 'https://github.com/terms',
          }),
        )
        .setColor(Colors.Blue)
        .setAuthor({
          name: clientUsername,
          iconURL: clientAvatar,
          url: 'https://github.com',
        })
        .setFooter({
          text: i18n('commands.about.copyright'),
        });

      await interaction.reply({ embeds: [aboutPersonalEmbed] });
      break;

    case 'license':
      await interaction.reply({
        content: i18n('commands.about.not_implemented'),
        ephemeral: true,
      });
      break;

    case 'stats':
      await interaction.deferReply();

      const totalCommands = (interaction.client as any).commands?.size ?? 0;
      const totalServers = interaction.client.guilds.cache.size;

      const statsEmbed = new EmbedBuilder()
        .setColor(Colors.Blue)
        .setAuthor({ iconURL: clientAvatar, name: clientUsername })
        .setTitle(i18n('commands.about.stats'))
        .setDescription(i18n('commands.about.public_stats'))
        .setTimestamp()
        .setFields([
          {
            name: i18n('commands.about.commands'),
            value: String(totalCommands),
            inline: true,
          },
          {
            name: i18n('commands.about.guilds'),
            value: String(totalServers),
            inline: true,
          },
        ]);

      await interaction.editReply({ embeds: [statsEmbed] });
      break;
  }
}
