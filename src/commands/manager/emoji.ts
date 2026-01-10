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
  .setName('emoji')
  .setDescription('Manage this server emojis.')
  .setDescriptionLocalizations({
    th: 'จัดการอีโมจิของเซิร์ฟเวอร์นี้',
  })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
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
      .setName('add')
      .setDescription('Add emojis on this server.')
      .setDescriptionLocalizations({
        th: 'เพิ่มอีโมจิบนเซิร์ฟเวอร์นี้',
      })
      .addAttachmentOption((option) =>
        option
          .setName('emoji')
          .setDescription('Emoji images.')
          .setDescriptionLocalizations({
            th: 'ภาพของอีโมจิ',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('name')
          .setDescription('The name of the emoji.')
          .setDescriptionLocalizations({
            th: 'ชื่อของอีโมจิ',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('Reason for creation.')
          .setDescriptionLocalizations({
            th: 'เหตุผลของการเพิ่ม',
          })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('delete')
      .setDescription('Remove emojis on this server.')
      .setDescriptionLocalizations({
        th: 'ลบอีโมจิบนเซิร์ฟเวอร์นี้',
      })
      .addStringOption((option) =>
        option
          .setName('emoji')
          .setDescription('Emoji ID.')
          .setDescriptionLocalizations({
            th: 'รหัสของอีโมจิ',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('Reason for deletion.')
          .setDescriptionLocalizations({
            th: 'เหตุผลของการลบ',
          })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('List all emojis on this server.')
      .setDescriptionLocalizations({
        th: 'แสดงรายการอีโมจิทั้งหมด',
      }),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageGuildExpressions,
];
export const category = 'manager';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputEmoji = interaction.options.getAttachment('emoji');
  const inputName = interaction.options.getString('name');
  const inputEmojiId = interaction.options.getString('emoji');
  const inputReason = interaction.options.getString('reason') ?? 'No reason provided';

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.emoji.guild_only'));
  }

  switch (subcommand) {
    case 'add': {
      if (!inputEmoji || !inputName) {
        return await interaction.reply({
          content: i18n('commands.emoji.missing_required'),
          ephemeral: true,
        });
      }

      try {
        const emoji = await interaction.guild.emojis.create({
          attachment: inputEmoji.url,
          name: inputName,
          reason: inputReason,
        });

        const addEmbed = new EmbedBuilder()
          .setColor('Green')
          .setTitle(i18n('commands.emoji.added_title'))
          .setDescription(i18n('commands.emoji.added_description').replace('%s', emoji.toString()))
          .addFields(
            { name: i18n('commands.emoji.name_field'), value: inputName, inline: true },
            { name: i18n('commands.emoji.id_field'), value: emoji.id, inline: true }
          )
          .setThumbnail(emoji.url)
          .setTimestamp();

        return await interaction.reply({ embeds: [addEmbed] });
      } catch (error) {
        console.error('Error adding emoji:', error);
        return await interaction.reply({
          content: i18n('commands.emoji.add_error'),
          ephemeral: true,
        });
      }
    }
    case 'delete': {
      if (!inputEmojiId) {
        return await interaction.reply({
          content: i18n('commands.emoji.missing_required'),
          ephemeral: true,
        });
      }

      try {
        const emoji = await interaction.guild.emojis.fetch(inputEmojiId);
        if (!emoji) {
          return await interaction.reply({
            content: i18n('commands.emoji.not_found'),
            ephemeral: true,
          });
        }

        await emoji.delete(inputReason);

        const deleteEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle(i18n('commands.emoji.deleted_title'))
          .setDescription(i18n('commands.emoji.deleted_description').replace('%s', emoji.name))
          .addFields(
            { name: i18n('commands.emoji.name_field'), value: emoji.name, inline: true },
            { name: i18n('commands.emoji.id_field'), value: emoji.id, inline: true }
          )
          .setThumbnail(emoji.url)
          .setTimestamp();

        return await interaction.reply({ embeds: [deleteEmbed] });
      } catch (error) {
        console.error('Error deleting emoji:', error);
        return await interaction.reply({
          content: i18n('commands.emoji.delete_error'),
          ephemeral: true,
        });
      }
    }
    case 'list': {
      const emojis = interaction.guild.emojis.cache;
      if (emojis.size === 0) {
        return await interaction.reply({
          content: i18n('commands.emoji.no_emojis'),
          ephemeral: true,
        });
      }

      const listEmbed = new EmbedBuilder()
        .setColor('Blue')
        .setTitle(i18n('commands.emoji.list_title'))
        .setDescription(i18n('commands.emoji.list_description').replace('%s', emojis.size))
        .setTimestamp();

      const animatedEmojis = emojis.filter(emoji => emoji.animated);
      const staticEmojis = emojis.filter(emoji => !emoji.animated);

      if (animatedEmojis.size > 0) {
        listEmbed.addFields({
          name: i18n('commands.emoji.animated_title'),
          value: animatedEmojis.map(emoji => `${emoji} \`:${emoji.name}:\``).join(' '),
          inline: false,
        });
      }

      if (staticEmojis.size > 0) {
        listEmbed.addFields({
          name: i18n('commands.emoji.static_title'),
          value: staticEmojis.map(emoji => `${emoji} \`:${emoji.name}:\``).join(' '),
          inline: false,
        });
      }

      return await interaction.reply({ embeds: [listEmbed] });
    }
  }
}
