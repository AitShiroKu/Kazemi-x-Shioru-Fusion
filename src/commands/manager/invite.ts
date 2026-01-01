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
  .setName('invite')
  .setDescription('Create and receive invitation links to join server.')
  .setDescriptionLocalizations({
    th: 'สร้างและรับลิงค์คำเชิญเพื่อเข้าร่วมเซิร์ฟเวอร์อื่นๆ',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('guild')
      .setDescription('Create an invitation link for joining this server.')
      .setDescriptionLocalizations({
        th: 'สร้างลิงค์คำเชิญเพื่อเข้าร่วมเซิร์ฟเวอร์อื่นๆ',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('me')
      .setDescription('Invite me to other servers.')
      .setDescriptionLocalizations({
        th: 'เชิญฉันไปยังเซิร์ฟเวอร์อื่นๆ',
      }),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.CreateInstantInvite,
];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.invite.guild_only'));
  }

  switch (subcommand) {
    case 'guild':
      try {
        const invite = await (interaction.channel as any).createInvite();
        const guildIcon = interaction.guild.iconURL();
        const inviteEmbed = new EmbedBuilder()
          .setTitle(
            i18n('commands.invite.membership_invitation_card'),
          )
          .setDescription(`||${invite.url}||`)
          .setColor(Colors.LightGrey)
          .setFooter({
            text: i18n('commands.invite.this_product_is_free'),
            iconURL: guildIcon ?? undefined,
          });

        await interaction.reply({ embeds: [inviteEmbed] });
      } catch (error) {
        console.error('Error creating invite:', error);
      }
      break;
    case 'me':
      try {
        const link = (interaction.client as any).generateInvite({
          scopes: ['applications.commands', 'bot'],
          permissions: [PermissionFlagsBits.Administrator],
        });

        await interaction.reply(link);
      } catch (error) {
        await interaction.reply(
          i18n('commands.invite.can_not_create_invite_link'),
        );
      }
      break;
  }

  return;
}
