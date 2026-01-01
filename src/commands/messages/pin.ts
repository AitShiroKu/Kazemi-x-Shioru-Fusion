import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('pin')
  .setDescription('Manage message pinning')
  .setDescriptionLocalizations({ th: 'จัดการปักหมุดข้อความ' })
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
      .setDescription('Pin desired message')
      .setDescriptionLocalizations({ th: 'ปักหมุดข้อความที่ต้องการ' })
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID of message you want to pin')
          .setDescriptionLocalizations({
            th: 'ไอดีของข้อความที่ต้องการปักหมุด',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('Reason for pinning message')
          .setDescriptionLocalizations({ th: 'เหตุผลที่ปักหมุดข้อความ' })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Unpin pinned messages')
      .setDescriptionLocalizations({ th: 'เลิกปักหมุดข้อความที่ปักหมุด' })
      .addStringOption((option) =>
        option
          .setName('id')
          .setDescription('ID of message you want to unpin')
          .setDescriptionLocalizations({
            th: 'ไอดีของข้อความที่ต้องการปักหมุด',
          })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('reason')
          .setDescription('Reason for unpinning messages')
          .setDescriptionLocalizations({ th: 'เหตุผลที่เลิกปักหมุดข้อความ' })
          .setRequired(false),
      ),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageMessages,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputID = interaction.options.getString('id');
  const inputReason = interaction.options.getString('reason') ?? '';

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  try {
    const message = await (interaction.channel as any).messages.fetch(inputID);

    if (!message)
      return await interaction.reply({
        content: i18n('commands.pin.message_not_found'),
        ephemeral: true,
      });
    if (!message.pinnable)
      return await interaction.reply({
        content: i18n('commands.pin.can_not_pin'),
        ephemeral: true,
      });

    if (subcommand === 'add') {
      await message.pin({ reason: inputReason });
      await interaction.reply({
        content: i18n('commands.pin.pinned'),
        ephemeral: true,
      });
    } else {
      if (!message.pinned)
        return await interaction.reply({
          content: i18n('commands.pin.is_not_pinned'),
          ephemeral: true,
        });

      await message.unpin({ reason: inputReason });
      await interaction.reply({
        content: i18n('commands.pin.unpinned'),
        ephemeral: true,
      });
    }
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
