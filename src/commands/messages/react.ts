import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('react')
  .setDescription('Interact with desired message')
  .setDescriptionLocalizations({ th: 'โต้ตอบกับข้อความที่ต้องการ' })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addStringOption((option) =>
    option
      .setName('id')
      .setDescription('ID of message you want to interact')
      .setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการโต้ตอบ' })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('emoji')
      .setDescription('Emoji to interact with')
      .setDescriptionLocalizations({ th: 'อีโมจิที่ต้องการโต้ตอบ' })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageMessages,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputID = interaction.options.getString('id');
  const inputEmoji = interaction.options.getString('emoji');

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  try {
    const message = await (interaction.channel as any).messages.fetch(inputID);

    if (!message)
      return await interaction.reply({
        content: i18n('commands.react.message_not_found'),
        ephemeral: true,
      });

    // Simple emoji reaction - just use the emoji string directly
    await message.react(inputEmoji);

    await interaction.reply({
      content: i18n('commands.react.reacted'),
      ephemeral: true,
    });
  } catch (error: any) {
    await interaction.reply({
      content: `Error: ${error.message}`,
      ephemeral: true,
    });
  }
}
