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
  .setName('help')
  .setDescription('Get help using it.')
  .setDescriptionLocalizations({
    th: 'รับความช่วยเกี่ยวกับการใช้งาน',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'me';

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const i18n = client.i18n.t;

  const clientUsername = interaction.client.user.username;
  const clientAvatar = interaction.client.user.displayAvatarURL();

  const helpEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setAuthor({ iconURL: clientAvatar, name: clientUsername })
    .setTitle(i18n('commands.help.ask_for_help'))
    .setDescription(i18n('commands.help.greeting_message'))
    .setTimestamp()
    .setFooter({
      text: i18n('commands.help.refer_from_user_language'),
    });

  await interaction.reply({ embeds: [helpEmbed] });
}
