import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('qrcode')
  .setDescription('Generate your QR code.')
  .setDescriptionLocalizations({ th: 'สร้างคิวอาร์โค้ดของคุณ' })
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
      .setDescription('Messages or links that want to create QR code.')
      .setDescriptionLocalizations({
        th: 'ข้อความหรือลิงค์ที่ต้องการจะสร้างคิวอาร์โค้ด',
      })
      .setRequired(true),
  )
  .addIntegerOption((option) =>
    option
      .setName('size')
      .setDescription(
        'Size of the QR code image you want to generate. (Default is 200)',
      )
      .setDescriptionLocalizations({
        th: 'ขนาดของภาพคิวอาร์โค้ดที่คุณต้องการสร้าง (ค่าเริ่มต้นคือ 200)',
      })
      .setMinValue(10)
      .setMaxValue(1000000),
  )
  .addStringOption((option) =>
    option
      .setName('ecc')
      .setDescription('QR code quality to reduce errors (Default is low)')
      .setDescriptionLocalizations({
        th: 'คุณภาพของคิวอาร์โค้ดเพื่อลดข้อผิดพลาด (ค่าเริ่มต้นคือต่ำ)',
      })
      .addChoices(
        { name: 'Low', name_localizations: { th: 'ต่ำ' }, value: 'L' },
        { name: 'Middle', name_localizations: { th: 'กลาง' }, value: 'M' },
        { name: 'Quality', name_localizations: { th: 'คุณภาพ' }, value: 'Q' },
        { name: 'High', name_localizations: { th: 'สูง' }, value: 'H' },
      ),
  )
  .addStringOption((option) =>
    option
      .setName('format')
      .setDescription('QR code file format image. (Default is PNG)')
      .setDescriptionLocalizations({
        th: 'รูปแบบไฟล์ของภาพคิวอาร์โค้ด (ค่าเริ่มต้นคือ PNG)',
      })
      .addChoices(
        { name: 'PNG', value: 'png' },
        { name: 'GIF', value: 'gif' },
        { name: 'JPEG', value: 'jpeg' },
        { name: 'JPG', value: 'jpg' },
        { name: 'SVG', value: 'svg' },
        { name: 'EPS', value: 'eps' },
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputContent = interaction.options.getString('content', true);
  let inputSize = interaction.options.getInteger('size') ?? 200;
  const inputECC = interaction.options.getString('ecc') ?? 'L';
  const inputFormat = interaction.options.getString('format') ?? 'png';

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  await interaction.deferReply();

  if (
    ['png', 'gif', 'jpeg', 'jpg'].includes(inputFormat) &&
    inputSize >= 1000
  ) {
    inputSize = 1000;
    await interaction.editReply(i18n('commands.qrcode.image_size_too_large'));
  }

  const response = await fetch(
    `https://api.qrserver.com/v1/create-qr-code?data=${encodeURI(inputContent)}&size=${inputSize}x${inputSize}&ecc=${inputECC}&format=${inputFormat}`,
  );

  if (response.status !== 200) {
    const msg = i18n('commands.qrcode.can_not_generate');
    if (interaction.replied) {
      await interaction.followUp(msg);
      return;
    }

    await interaction.editReply(msg);
    return;
  }

  const url = response.url;
  const qrCodeEmbed = new EmbedBuilder()
    .setColor(Colors.White)
    .setTitle(i18n('commands.qrcode.qr_code'))
    .setDescription(i18n('commands.qrcode.qr_code_generated'))
    .setImage(url)
    .setTimestamp();

  await interaction.editReply({ embeds: [qrCodeEmbed] });
}

export default { data, execute, permissions, category };
