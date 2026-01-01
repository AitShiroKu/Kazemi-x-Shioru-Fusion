import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('attachment')
  .setDescription('Upload file and send it in chat.')
  .setDescriptionLocalizations({
    th: 'อัปโหลดไฟล์แล้วส่งไปในแชท',
  })
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addAttachmentOption((option) =>
    option
      .setName('attachment')
      .setDescription('Things to be attached to message to be sent.')
      .setDescriptionLocalizations({
        th: 'สิ่งที่ต้องการแนบไปด้วยข้อความที่จะส่ง',
      })
      .setRequired(true),
  )
  .addChannelOption((option) =>
    option
      .setName('channel')
      .setDescription('The channel to send attachment to')
      .setDescriptionLocalizations({ th: 'ช่องที่จะส่งไฟล์' })
      .setRequired(false),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.AttachFiles,
];
export const category = 'messages';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputAttachment = interaction.options.getAttachment('attachment');
  const inputChannel = interaction.options.getChannel('channel') ?? null;

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!inputChannel) {
    await (interaction.channel as any).send({ files: [inputAttachment] });
  } else {
    await (inputChannel as any).send({ files: [inputAttachment] });
  }

  await interaction.reply({
    content: inputChannel
      ? i18n('commands.attachment.sended_to_channel', {
          id: inputChannel.id,
        })
      : i18n('commands.attachment.sended'),
    ephemeral: true,
  });
}
