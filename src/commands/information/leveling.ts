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

export const data = new SlashCommandBuilder()
  .setName('leveling')
  .setDescription('See information about your level.')
  .setDescriptionLocalizations({ th: 'ดูข้อมูลเกี่ยวกับเลเวลของคุณ' })
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addUserOption((option) =>
    option
      .setName('member')
      .setDescription('The name of the member you wish to view the level.')
      .setDescriptionLocalizations({
        th: 'ชื่อของสมาชิกที่คุณต้องการดูระดับของเขา',
      })
      .setRequired(false),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'information';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputMember = interaction.options.getMember('member');

  await interaction.deferReply();

  let author = interaction.user as any;
  let authorAvatar = author.displayAvatarURL() || '';
  let authorFetch = await author.fetch();
  let memberBot = false;

  if (inputMember) {
    author = inputMember;
    authorAvatar = author.avatarURL() || '';
    authorFetch = await author.fetch();
    memberBot = author.bot;
  }

  if (memberBot)
    return await interaction.editReply(
      (interaction.client as any).i18n.t('commands.leveling.bot_do_not_have_level'),
    );

  // TODO: Implement database integration for leveling system
  // This command requires Firebase database integration
  // Currently showing a placeholder message

  const levelingEmbed = new EmbedBuilder()
    .setTitle((interaction.client as any).i18n.t('commands.leveling.your_experience'))
    .setColor(authorFetch.accentColor || Colors.Blue)
    .setThumbnail(authorAvatar)
    .setDescription(
      (interaction.client as any).i18n.t('commands.leveling.leveling_system_placeholder'),
    )
    .setTimestamp()
    .addFields([
      {
        name: (interaction.client as any).i18n.t('commands.leveling.level'),
        value: '```' + '0' + '```',
      },
      {
        name: (interaction.client as any).i18n.t('commands.leveling.experience'),
        value: '```' + '0' + '/' + '100' + '```',
      },
    ]);

  await interaction.editReply({ embeds: [levelingEmbed] });
}
