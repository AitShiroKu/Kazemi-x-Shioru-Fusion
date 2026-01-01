import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
  ChannelType,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('crosspost')
  .setDescription(
    'Publishes a message in an announcement channel to all channels following it.',
  )
  .setDescriptionLocalizations({
    th: 'เผยแพร่ข้อความในช่องประกาศไปยังทุกช่องที่ติดตาม',
  })
  .setDefaultMemberPermissions(null)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addStringOption((option) =>
    option
      .setName('id')
      .setDescription('ID of message to be published')
      .setDescriptionLocalizations({ th: 'ไอดีของข้อความที่ต้องการเผยแพร่' })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ManageMessages,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const i18n = client.i18n.t;

  const inputID = interaction.options.getString('id', true);

  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildAnnouncement)
    return await interaction.reply({
      content: i18n('commands.crosspost.is_not_valid_type'),
      ephemeral: true,
    });

  try {
    const message = await (interaction.channel as any).messages.fetch(inputID);

    if (!message)
      return await interaction.reply({
        content: i18n('commands.crosspost.message_not_found'),
        ephemeral: true,
      });
    if (!message.crosspostable)
      return await interaction.reply({
        content: i18n('commands.crosspost.can_not_published'),
        ephemeral: true,
      });

    await message.crosspost();

    await interaction.reply({
      content: i18n('commands.crosspost.published'),
      ephemeral: true,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    await interaction.reply({
      content: `Error: ${errMsg}`,
      ephemeral: true,
    });
  }
}
