import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('paste')
  .setDescription('Paste the text in sourceb.in.')
  .setDescriptionLocalizations({ th: 'วางข้อความใน sourceb.in' })
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
      .setName('content')
      .setDescription('Content to be placed')
      .setDescriptionLocalizations({ th: 'เนื้อหาที่ต้องการจะวาง' })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('title')
      .setDescription('The title is about the content to be pasted.')
      .setDescriptionLocalizations({ th: 'ชื่อเรื่องเกี่ยวกับเนื้อหาที่จะวาง' }),
  )
  .addStringOption((option) =>
    option
      .setName('description')
      .setDescription('Description of what you are writing.')
      .setDescriptionLocalizations({ th: 'คำอธิบายของสิ่งคุณกำลังเขียน' }),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputTitle = interaction.options.getString('title') ?? '';
  const inputDescription = interaction.options.getString('description') ?? '';
  const inputContent = interaction.options.getString('content', true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  await interaction.deferReply();

  const response = await fetch('https://sourceb.in/api/bins', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: inputTitle,
      description: inputDescription,
      files: [{ name: inputTitle || 'paste', content: inputContent }],
    }),
  });

  if (response.status !== 200) {
    await interaction.editReply(i18n('commands.paste.backend_not_response'));
    return;
  }

  const data = (await response.json()) as any;
  const url = `https://sourceb.in/${data.key}`;
  const raw = `https://cdn.sourceb.in/bins/${data.key}/0`;

  await interaction.editReply(
    [
      '**Sourcebin**',
      `🔸 ${i18n('commands.paste.file')}: <${url}>`,
      `🔹 ${i18n('commands.paste.raw')}: <${raw}>`,
    ].join('\n'),
  );
}

export default { data, execute, permissions, category };
