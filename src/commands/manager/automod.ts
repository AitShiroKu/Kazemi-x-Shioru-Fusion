import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  MessageFlags,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('automod')
  .setDescription('Manage your server with automation.')
  .setDescriptionLocalizations({
    th: 'จัดการเซิร์ฟเวอร์ของคุณด้วยระบบอัตโนมัติ',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('flagged_words')
      .setDescription('Block profanity, sexual content, and slurs')
      .setDescriptionLocalizations({
        th: 'บล็อกคำหยาบเนื้อหาเกี่ยวกับเรื่องเพศและคำสบประมาท',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('spam_messages')
      .setDescription('Prevent message spam')
      .setDescriptionLocalizations({ th: 'ป้องกันการสแปมข้อความ' }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('mention_spam')
      .setDescription('Prevent unnecessary mention spam.')
      .setDescriptionLocalizations({
        th: 'ป้องกันการสแปมการกล่าวถึงที่ไม่จำเป็น',
      })
      .addIntegerOption((option) =>
        option
          .setName('count')
          .setDescription('Number of unnecessary mentions')
          .setDescriptionLocalizations({
            th: 'จำนวนของการกล่าวถึงที่ไม่จำเป็น',
          })
          .setRequired(true)
          .setMinValue(0)
          .setMaxValue(50),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('keyword')
      .setDescription('Block unwanted or forbidden words.')
      .setDescriptionLocalizations({
        th: 'บล็อกคำที่ไม่ต้องการหรือคำต้องห้าม',
      })
      .addStringOption((option) =>
        option
          .setName('word')
          .setDescription(
            'Words to be blocked which, if found, will not be able to send messages.',
          )
          .setDescriptionLocalizations({
            th: 'คำที่ต้องการบล็อค ซึ่งหากพบจะไม่สามารถส่งข้อความได้',
          })
          .setRequired(true)
          .setMinLength(0)
          .setMaxLength(1000),
      ),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageGuild,
];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputCount = interaction.options.getInteger('count') ?? 0;
  const inputWord = interaction.options.getString('word') ?? '';

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.automod.guild_only'));
  }

  // Implementation using Discord's AutoModeration API
  switch (subcommand) {
    case 'flagged_words': {
      try {
        const teamOwner = interaction.client.user.id;
        
        const flaggedWordsRule = await interaction.guild.autoModerationRules.create({
          name: i18n('commands.automod.flagged_words_name'),
          enabled: true,
          eventType: 1,
          triggerType: 4,
          triggerMetadata: { presets: [1, 2, 3] },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel?.id,
                durationSeconds: 10,
                customMessage: i18n('commands.automod.prevent_message'),
              },
            },
          ],
        });

        const flaggedWordsEmbed = new EmbedBuilder()
          .setColor('Blue')
          .setDescription(i18n('commands.automod.flagged_words_success'));

        return await interaction.reply({ embeds: [flaggedWordsEmbed] });
      } catch (error) {
        console.error('Error creating flagged words rule:', error);
        return await interaction.reply({
          content: i18n('commands.automod.error_creating_rule'),
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    case 'spam_messages': {
      try {
        const teamOwner = interaction.client.user.id;
        
        const spamMessagesRule = await interaction.guild.autoModerationRules.create({
          name: i18n('commands.automod.spam_messages_name'),
          enabled: true,
          eventType: 1,
          triggerType: 3,
          triggerMetadata: {},
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel?.id,
                durationSeconds: 10,
                customMessage: i18n('commands.automod.prevent_message'),
              },
            },
          ],
        });

        const spamMessagesEmbed = new EmbedBuilder()
          .setColor('Blue')
          .setDescription(i18n('commands.automod.spam_messages_success'));

        return await interaction.reply({ embeds: [spamMessagesEmbed] });
      } catch (error) {
        console.error('Error creating spam messages rule:', error);
        return await interaction.reply({
          content: i18n('commands.automod.error_creating_rule'),
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    case 'mention_spam': {
      try {
        const teamOwner = interaction.client.user.id;
        
        const mentionSpamRule = await interaction.guild.autoModerationRules.create({
          name: i18n('commands.automod.mention_spam_name'),
          enabled: true,
          eventType: 1,
          triggerType: 5,
          triggerMetadata: { mentionTotalLimit: inputCount },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel?.id,
                durationSeconds: 10,
                customMessage: i18n('commands.automod.prevent_message'),
              },
            },
          ],
        });

        const mentionSpamEmbed = new EmbedBuilder()
          .setColor('Blue')
          .setDescription(i18n('commands.automod.mention_spam_success'));

        return await interaction.reply({ embeds: [mentionSpamEmbed] });
      } catch (error) {
        console.error('Error creating mention spam rule:', error);
        return await interaction.reply({
          content: i18n('commands.automod.error_creating_rule'),
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    case 'keyword': {
      try {
        const teamOwner = interaction.client.user.id;
        
        const keywordRule = await interaction.guild.autoModerationRules.create({
          name: i18n('commands.automod.keyword_name').replace('%s', inputWord),
          enabled: true,
          eventType: 1,
          triggerType: 1,
          triggerMetadata: {
            keywordFilter: [inputWord],
          },
          actions: [
            {
              type: 1,
              metadata: {
                channel: interaction.channel?.id,
                durationSeconds: 10,
                customMessage: i18n('commands.automod.prevent_message'),
              },
            },
          ],
        });

        const keywordEmbed = new EmbedBuilder()
          .setColor('Blue')
          .setDescription(i18n('commands.automod.keyword_success').replace('%s', inputWord));

        return await interaction.reply({ embeds: [keywordEmbed] });
      } catch (error) {
        console.error('Error creating keyword rule:', error);
        return await interaction.reply({
          content: i18n('commands.automod.error_creating_rule'),
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  }
}
