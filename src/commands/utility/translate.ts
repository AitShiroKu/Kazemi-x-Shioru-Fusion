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
  .setName('translate')
  .setDescription('Translate text')
  .setDescriptionLocalizations({ th: 'แปลภาษาข้อความ' })
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
      .setName('message')
      .setDescription('the text to be translated')
      .setDescriptionLocalizations({ th: 'ข้อความที่ต้องการจะแปล' })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('from')
      .setDescription(
        'Language code of the text to be translated, such as en, th, ja.',
      )
      .setDescriptionLocalizations({
        th: 'รหัสภาษาของข้อความที่ต้องการจะแปล เช่น en, th, ja',
      }),
  )
  .addStringOption((option) =>
    option
      .setName('to')
      .setDescription('Language codes to translate text such as en, th, ja')
      .setDescriptionLocalizations({
        th: 'รหัสภาษาที่จะแปลข้อความเช่น en, th, ja',
      }),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputFrom = interaction.options.getString('from') ?? 'auto';
  const inputTo = interaction.options.getString('to') ?? interaction.locale;
  const inputMessage = interaction.options.getString('message', true);

  const client = interaction.client as any;
  const i18n = client.i18n?.t ?? ((k: string) => k);

  await interaction.deferReply();

  const baseURL = client.configs?.translation?.baseURL;

  if (!baseURL) {
    await interaction.editReply({
      content: i18n('commands.translate.base_url_is_missing'),
    });
    return;
  }

  const response = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({
      sl: inputFrom,
      tl: inputTo,
      q: inputMessage,
    }).toString(),
  });

  if (response.status !== 200) {
    await interaction.editReply({
      content: i18n('commands.translate.can_not_translate'),
    });
    return;
  }

  const data = (await response.json()) as any;
  const source = data?.src;
  const sentences = Array.isArray(data?.sentences) ? data.sentences : [];
  const translate = sentences.find((sentence: any) => 'trans' in sentence)?.trans;
  const transliteration = sentences.find((sentence: any) => 'src_translit' in sentence)?.src_translit;

  if (!translate) {
    await interaction.editReply({
      content: i18n('commands.translate.can_not_translate'),
    });
    return;
  }

  const userUsername = interaction.user.username;
  const userAvatar = interaction.user.avatarURL() ?? undefined;

  const translateEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTimestamp()
    .setDescription(`\`\`\`${translate}\`\`\`` + (transliteration ? `\n> ${transliteration}` : ''))
    .setAuthor({
      iconURL: userAvatar,
      name: `${userUsername} ${i18n('commands.translate.says')}`,
    })
    .setFooter({ text: `[${source}] -> [${inputTo}]` });

  await interaction.editReply({ embeds: [translateEmbed] });
}

export default { data, execute, permissions, category };
