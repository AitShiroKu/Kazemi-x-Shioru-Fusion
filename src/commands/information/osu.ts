import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('osu')
  .setDescription('Generate profile statistics from osu! game.')
  .setDescriptionLocalizations({
    th: 'สร้างสถิติโปรไฟล์จากเกม osu!',
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
  .addStringOption((option) =>
    option
      .setName('username')
      .setDescription('Username or UID')
      .setDescriptionLocalizations({ th: 'ชื่อผู้ใช้หรือ UID' })
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('mode')
      .setDescription('Game modes in osu!')
      .setDescriptionLocalizations({ th: 'โหมดเกมใน osu!' })
      .setChoices(
        { name: 'Standard', value: 'std' },
        { name: 'Taiko', value: 'taiko' },
        { name: 'Catch', value: 'catch' },
        { name: 'Mania', value: 'mania' },
      ),
  )
  .addStringOption((option) =>
    option
      .setName('layout')
      .setDescription('Game modes in osu!')
      .setDescriptionLocalizations({ th: 'เค้าโครงสถิติที่ต้องการ' })
      .setChoices(
        {
          name: 'Full with Stats',
          name_localizations: { th: 'แบบเต็มพร้อมสถิติ' },
          value: 'full_stats',
        },
        {
          name: 'Full with Skills',
          name_localizations: { th: 'แบบเต็มพร้อมทักษะ' },
          value: 'full_skills',
        },
        { name: 'Mini', name_localizations: { th: 'มินิ' }, value: 'mini' },
        {
          name: 'Skills',
          name_localizations: { th: 'ทักษะ' },
          value: 'skills',
        },
      ),
  )
  .addStringOption((option) =>
    option
      .setName('ranking')
      .setDescription('Select the rating type for the **skills** layout.')
      .setDescriptionLocalizations({
        th: 'เลือกประเภทของจัดอันดับสำหรับเค้าโครง **skills**',
      })
      .setChoices(
        {
          name: 'Global',
          name_localizations: { th: 'ทั่วโลก' },
          value: 'global',
        },
        {
          name: 'Country',
          name_localizations: { th: 'ประเทศ' },
          value: 'country',
        },
        {
          name: 'Both',
          name_localizations: { th: 'ทั้งคู่' },
          value: 'cycle',
        },
      ),
  )
  .addNumberOption((option) =>
    option
      .setName('width')
      .setDescription('Image width')
      .setDescriptionLocalizations({ th: 'ขนาดความกว้างของรูป' })
      .setMinValue(20)
      .setMaxValue(9999),
  )
  .addNumberOption((option) =>
    option
      .setName('height')
      .setDescription('Image height')
      .setDescriptionLocalizations({ th: 'ขนาดความสูงของรูป' })
      .setMinValue(12)
      .setMaxValue(5818),
  )
  .addNumberOption((option) =>
    option
      .setName('blur')
      .setDescription('Blurring of the background image.')
      .setDescriptionLocalizations({ th: 'ความเบลอของภาพื้นหลัง' })
      .setMinValue(0)
      .setMaxValue(100),
  )
  .addBooleanOption((option) =>
    option
      .setName('rounded')
      .setDescription('Want your profile picture to be rounded? (Default is false)')
      .setDescriptionLocalizations({ th: 'ต้องการให้โปรไฟล์โค้งมนหรือไม่' }),
  )
  .addBooleanOption((option) =>
    option
      .setName('animation')
      .setDescription('Want to add animation to your images? (Default is true)')
      .setDescriptionLocalizations({
        th: 'ต้องการเพิ่มอนิเมชั่นลงไปในภาพหรือไม่',
      }),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'information';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputUsername = interaction.options.getString('username')!;
  const inputMode = interaction.options.getString('mode') ?? 'std';
  const inputLayout = interaction.options.getString('layout') ?? 'full_stats';
  const inputRanking = interaction.options.getString('ranking') ?? 'global';
  const inputWidth = interaction.options.getNumber('width') ?? 550;
  const inputHeight = interaction.options.getNumber('height') ?? 320;
  const inputBlur = interaction.options.getNumber('blur') ?? 0;
  const inputRounded = interaction.options.getBoolean('rounded') ?? false;
  const inputAnimation = interaction.options.getBoolean('animation') ?? true;

  if (
    ['taiko', 'catch', 'mania'].includes(inputMode) &&
    inputLayout === 'skills'
  )
    return await interaction.reply(
      (interaction.client as any).i18n.t('commands.osu.layout_not_support', {
        mode: inputMode.charAt(0).toUpperCase() + inputMode.slice(1),
      }),
    );

  await interaction.deferReply();

  const url = new URL(
    inputLayout === 'skills'
      ? 'https://osu-sig.vercel.app/skills'
      : 'https://osu-sig.vercel.app/card',
  );
  const params: Record<string, string | number | boolean | null> = {
    user: inputUsername!,
    mode: inputMode,
    lang: 'en',
    animation: inputAnimation,
    skills: inputLayout === 'full_skills',
    mini: inputLayout === 'mini',
    ranking_display: inputRanking === 'global' ? null : inputRanking,
    w: inputWidth,
    h: inputHeight,
    blur: inputBlur,
    round_avatar: inputRounded,
  };

  for (const key in params) {
    const value = params[key];
    if (value !== null && typeof value !== 'undefined') {
      url.searchParams.append(key, String(value));
    }
  }

  try {
    const response = await fetch(url);
    const responseURL = response.url;
    const attachment = new AttachmentBuilder(responseURL, {
      name: `${inputUsername}.svg`,
    });

    await interaction.editReply({
      content: (interaction.client as any).i18n.t('commands.osu.generated', {
        url: responseURL,
        interpolation: { escapeValue: false },
      }),
      files: [attachment],
    });
  } catch (error) {
    if ((error as Error).message?.includes('Request aborted'))
      return await interaction.editReply(
        (interaction.client as any).i18n.t('commands.osu.request_aborted'),
      );

    await interaction.editReply(
      (interaction.client as any).i18n.t('commands.osu.request_error'),
    );
  }
}
