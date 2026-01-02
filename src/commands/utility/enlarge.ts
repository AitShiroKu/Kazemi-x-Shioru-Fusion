import {
  SlashCommandBuilder,
  parseEmoji,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('enlarge')
  .setDescription('Enlarge the emoji.')
  .setDescriptionLocalizations({ th: 'ขยายอิโมจิให้ใหญ่ขึ้น' })
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
  .addStringOption((option) =>
    option
      .setName('emoji')
      .setDescription('The emoji you want to be enlarged')
      .setDescriptionLocalizations({ th: 'อีโมจิที่ต้องการให้ขยายให้ใหญ่ขึ้น' })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.AttachFiles,
];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputEmoji = interaction.options.getString('emoji', true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const parsed = parseEmoji(inputEmoji);
  if (!parsed?.id) {
    await interaction.reply({
      content: i18n('commands.enlarge.emoji_not_found'),
      ephemeral: true,
    });
    return;
  }

  const fileType = parsed.animated ? 'gif' : 'png';
  const emojiURL = `https://cdn.discordapp.com/emojis/${parsed.id}.${fileType}`;
  await interaction.reply({ files: [emojiURL] });
}

export default { data, execute, permissions, category };
