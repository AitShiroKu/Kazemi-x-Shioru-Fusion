import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('issues')
  .setDescription('Report issue information about bots.')
  .setDescriptionLocalizations({
    th: 'รายงานข้อผิดพลาดเกี่ยวกับบอท',
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
      .setName('bug')
      .setDescription('Create a report to help us improve')
      .setDescriptionLocalizations({
        th: 'สร้างรายงานเพื่อช่วยเราปรุง',
      })
      .addStringOption((option) =>
        option
          .setName('title')
          .setDescription('Topic of problem encountered')
          .setDescriptionLocalizations({
            th: 'หัวข้อองปัญหาที่พบ',
          })
          .setRequired(true)
          .setMinLength(5),
      )
      .addStringOption((option) =>
        option
          .setName('description')
          .setDescription('Description of encountered problems')
          .setDescriptionLocalizations({
            th: 'คำอธิบายเกี่ยวกับปัญหาที่พบ',
          })
          .setRequired(false)
          .setMinLength(5),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('feature')
      .setDescription('Suggest an idea for this project')
      .setDescriptionLocalizations({
        th: 'เสนอแนวคิดสำหรับโครงการนี้',
      })
      .addStringOption((option) =>
        option
          .setName('title')
          .setDescription('Topic I would like to propose')
          .setDescriptionLocalizations({
            th: 'หัวข้อที่อยากจะเสนอ',
          })
          .setRequired(true)
          .setMinLength(5),
      )
      .addStringOption((option) =>
        option
          .setName('description')
          .setDescription('Description of feedback')
          .setDescriptionLocalizations({
            th: 'คำอธิบายของข้อเสนอแนะ',
          })
          .setRequired(false)
          .setMinLength(5),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'me';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputTitle = interaction.options.getString('title');
  const inputDescription = interaction.options.getString('description') ?? '';

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  const authorUid = interaction.user.id;
  const authorTag = interaction.user.tag;
  const date = new Date();

  switch (subcommand) {
    case 'bug':
      await interaction.reply(i18n('commands.issues.bug_sending'));
      
      const bugEmbed = new EmbedBuilder() as any;
      bugEmbed.setColor(Colors.Red);
      bugEmbed.setTitle('🛟・Issues');
      bugEmbed.setDescription(`The following bug was reported by ${authorTag}.`);
      bugEmbed.setTimestamp();
      bugEmbed.addFields(
        { name: '🏷️ Title', value: inputTitle, inline: true },
        { name: '📄 Description', value: inputDescription || 'None', inline: true },
      );
      
      await interaction.editReply({ embeds: [bugEmbed] });
      break;

    case 'feature':
      await interaction.reply(i18n('commands.issues.feature_sending'));
      
      const featureEmbed = new EmbedBuilder() as any;
      featureEmbed.setColor(Colors.Blue);
      featureEmbed.setTitle('🛟・Issues');
      featureEmbed.setDescription(`A new feature was requested from ${authorTag}.`);
      featureEmbed.setTimestamp();
      featureEmbed.addFields(
        { name: '🕒 Timestamp', value: date.toLocaleString(), inline: true },
        { name: '🏷️ Title', value: inputTitle, inline: true },
        { name: '📄 Description', value: inputDescription || 'None', inline: true },
      );
      
      await interaction.editReply({ embeds: [featureEmbed] });
      break;
  }
}
