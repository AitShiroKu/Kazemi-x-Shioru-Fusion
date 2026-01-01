import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import { Buffer } from 'node:buffer';

const encoding = [
  { name: 'ASCII', value: 'ascii' },
  { name: 'Base64', value: 'base64' },
  { name: 'Base64URL', value: 'base64url' },
  { name: 'Binary', value: 'binary' },
  { name: 'Hex', value: 'hex' },
  { name: 'Latin1', value: 'latin1' },
  { name: 'UCS-2', value: 'ucs-2' },
  { name: 'UCS2', value: 'ucs2' },
  { name: 'UTF-16LE', value: 'utf-16le' },
  { name: 'UTF-8', value: 'utf-8' },
  { name: 'UTF16LE', value: 'utf16le' },
  { name: 'UTF8', value: 'utf8' },
] as const;

export const data = new SlashCommandBuilder()
  .setName('encoder')
  .setDescription('Encrypt or decrypt your message.')
  .setDescriptionLocalizations({ th: 'เข้ารหัสหรือถอดรหัสข้อความของคุณ' })
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
  .addSubcommand((subcommand) =>
    subcommand
      .setName('encode')
      .setDescription('Encrypt your message.')
      .setDescriptionLocalizations({ th: 'เข้ารหัสข้อความของคุณ' })
      .addStringOption((option) =>
        option
          .setName('text')
          .setDescription('Message to be encrypted.')
          .setDescriptionLocalizations({ th: 'ข้อความที่ต้องการจะเข้ารหัส' })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('from')
          .setDescription('Choose an encoding method. (Default is UTF-8)')
          .setDescriptionLocalizations({
            th: 'เลือกวิธีการเข้ารหัส (ค่าเริ่มต้นคือ UTF-8)',
          })
          .setChoices(...encoding),
      )
      .addStringOption((option) =>
        option
          .setName('to')
          .setDescription('Choose an encoding method. (Default is Base64)')
          .setDescriptionLocalizations({
            th: 'เลือกวิธีการเข้ารหัส (ค่าเริ่มต้นคือ Base64)',
          })
          .setChoices(...encoding),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('decode')
      .setDescription('Decrypt your message.')
      .setDescriptionLocalizations({ th: 'ถอดรหัสข้อความของคุณ' })
      .addStringOption((option) =>
        option
          .setName('text')
          .setDescription('Message to be decrypted.')
          .setDescriptionLocalizations({ th: 'ข้อความที่ต้องการจะถอดรหัส' })
          .setRequired(true),
      )
      .addStringOption((option) =>
        option
          .setName('from')
          .setDescription('Choose an encoding method. (Default is Base64)')
          .setDescriptionLocalizations({
            th: 'เลือกวิธีการเข้ารหัส  (ค่าเริ่มต้นคือ Base64)',
          })
          .setChoices(...encoding),
      )
      .addStringOption((option) =>
        option
          .setName('to')
          .setDescription('Choose an encoding method. (Default is UTF-8)')
          .setDescriptionLocalizations({
            th: 'เลือกวิธีการเข้ารหัส (ค่าเริ่มต้นคือ UTF-8)',
          })
          .setChoices(...encoding),
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand(true);
  const inputText = interaction.options.getString('text', true);

  const inputFrom =
    interaction.options.getString('from') ??
    (subcommand === 'encode' ? 'utf-8' : 'base64');
  const inputTo =
    interaction.options.getString('to') ??
    (subcommand === 'encode' ? 'base64' : 'utf-8');

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  const clientAvatar = interaction.client.user?.displayAvatarURL() ?? undefined;
  const clientUsername = interaction.client.user?.username ?? 'Bot';

  const encoderEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setAuthor({ iconURL: clientAvatar, name: clientUsername })
    .setTimestamp();

  try {
    const result = Buffer.from(inputText, inputFrom as BufferEncoding).toString(
      inputTo as BufferEncoding,
    );

    if (subcommand === 'encode') {
      encoderEmbed
        .setTitle(i18n('commands.encoder.encode_message'))
        .setDescription(i18n('commands.encoder.encode_success'))
        .addFields(
          {
            name: i18n('commands.encoder.encode_before'),
            value: `\`\`\`${inputText}\`\`\``,
          },
          {
            name: i18n('commands.encoder.encode_after'),
            value: `\`\`\`${result}\`\`\``,
          },
        );
    } else {
      encoderEmbed
        .setTitle(i18n('commands.encoder.decode_message'))
        .setDescription(i18n('commands.encoder.decode_success'))
        .addFields(
          {
            name: i18n('commands.encoder.decode_before'),
            value: `\`\`\`${inputText}\`\`\``,
          },
          {
            name: i18n('commands.encoder.decode_after'),
            value: `\`\`\`${result}\`\`\``,
          },
        );
    }
  } catch (error) {
    client.logger?.error?.(error);
    encoderEmbed
      .setTitle(i18n('commands.encoder.decode_message'))
      .setDescription('```\nInvalid input or encoding.\n```')
      .setColor(Colors.Red);
  }

  await interaction.reply({ embeds: [encoderEmbed], ephemeral: true });
}

export default { data, execute, permissions, category };
