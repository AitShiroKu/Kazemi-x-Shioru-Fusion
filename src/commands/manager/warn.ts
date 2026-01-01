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
  .setName('warn')
  .setDescription('Warn user to stop doing something.')
  .setDescriptionLocalizations({
    th: 'เตือนผู้ใช้ให้หยุดกระทำบางอย่าง',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
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
      .setDescription('Members who want to be warned to stop doing something')
      .setDescriptionLocalizations({
        th: 'สมาชิกที่ต้องการเตือนให้หยุดกระทำบางอย่าง',
      })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('reason')
      .setDescription('Reason for warning such members.')
      .setDescriptionLocalizations({
        th: 'เหตุผลในการเตือนสมาชิกดังกล่าว',
      })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.KickMembers,
];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputMember = interaction.options.getUser('member', true);
  const inputWarn = interaction.options.getString('reason');

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.warn.guild_only'));
  }

  const member = await interaction.guild.members.fetch(inputMember.id);

  if (!member) {
    return await interaction.editReply(i18n('commands.warn.can_not_find_user'));
  }

  const authorPosition = (interaction.member as any).roles.highest.position;
  const memberPosition = member.roles.highest.position;

  if (authorPosition < memberPosition) {
    return await interaction.reply(
      i18n('commands.warn.members_have_a_higher_role'),
    );
  }

  if (!member.kickable) {
    return await interaction.reply(
      i18n('commands.warn.members_have_a_higher_role_than_me'),
    );
  }

  const warned = await (member as any).kick({ reason: inputWarn });
  const authorUsername = interaction.user.username;
  const memberAvatar = warned.user.avatarURL();
  const memberUsername = warned.user.username;

  const memberEmbed = new EmbedBuilder()
    .setTitle(i18n('commands.warn.you_have_warned', { manager: authorUsername }))
    .setDescription(i18n('commands.warn.you_have_warned', { reason: inputWarn }))
    .setColor(Colors.Orange)
    .setTimestamp()
    .setThumbnail(memberAvatar);
  const warnEmbed = new EmbedBuilder()
    .setTitle(i18n('commands.warn.you_have_warned', { user: memberUsername }))
    .setDescription(i18n('commands.warn.user_has_warned_by', {
      manager: authorUsername,
      reason: inputWarn,
    }))
    .setColor(Colors.Orange)
    .setTimestamp()
    .setThumbnail(memberAvatar);

  warned.send({ embeds: [memberEmbed] });
  await interaction.reply({ embeds: [warnEmbed] });
}
