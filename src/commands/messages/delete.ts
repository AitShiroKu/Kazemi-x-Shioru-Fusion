import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('delete')
  .setDescription('Delete unwanted messages')
  .setDescriptionLocalizations({ th: 'ลบข้อความที่ไม่ต้องการ' })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addStringOption((option) =>
    option
      .setName('id')
      .setDescription('ID of the message you want to delete')
      .setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการลบ' })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageMessages,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputID = interaction.options.getString('id', true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  try {
    const channel = interaction.channel as any;
    const message = await channel?.messages?.fetch?.(inputID);

    if (!message) {
      await interaction.reply({
        content: i18n('commands.delete.message_not_found'),
        ephemeral: true,
      });
      return;
    }

    if (!message.deletable) {
      await interaction.reply({
        content: i18n('commands.delete.can_not_delete'),
        ephemeral: true,
      });
      return;
    }

    await message.delete();

    await interaction.reply({
      content: i18n('commands.delete.deleted'),
      ephemeral: true,
    });
  } catch (error) {
    (client as any).logger?.error?.(error);
    await interaction.reply({
      content: i18n('commands.delete.can_not_delete'),
      ephemeral: true,
    });
  }
}

export default { data, execute, permissions, category };
