import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('tts')
  .setDescription('Text-to-Speech')
  .setDescriptionLocalizations({ th: 'แปลงข้อความเป็นคำพูด' })
  .setDefaultMemberPermissions(PermissionFlagsBits.SendTTSMessages)
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
      .setName('content')
      .setDescription('Text to be converted to speech.')
      .setDescriptionLocalizations({ th: 'ข้อความที่ต้องการจะแปลงเป็นคำพูด' })
      .setRequired(true),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.SendTTSMessages,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputContent = interaction.options.getString('content', true);
  await interaction.reply({ content: inputContent, tts: true });
}

export default { data, execute, permissions, category };
