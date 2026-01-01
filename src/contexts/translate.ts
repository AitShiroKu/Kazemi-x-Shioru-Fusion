import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  MessageContextMenuCommandInteraction,
} from 'discord.js';
import type { Context } from '../types/index.js';

export const data = new ContextMenuCommandBuilder()
  .setType(ApplicationCommandType.Message)
  .setName('translate')
  .setNameLocalizations({ th: 'แปลภาษา' })
  .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'utility';

export async function execute(interaction: MessageContextMenuCommandInteraction) {
  const client = interaction.client as any;
  const inputTo = interaction.locale;
  const inputMessage = interaction.targetMessage;

  await interaction.deferReply();

  const baseURL = client.configs.translation.baseURL;
  const locales = client.configs.translation.locales;

  if (!baseURL)
    return await interaction.editReply({
      content: client.i18n.t('commands.translate.base_url_is_missing', { lng: inputTo }),
      flags: { ephemeral: true } as any,
    });

  if (!locales[inputTo])
    return await interaction.editReply({
      content: client.i18n.t('commands.translate.translate_support', {
        lng: inputTo,
        locales: Object.keys(locales).join(', '),
      }),
      flags: { ephemeral: true } as any,
    });

  const response = await fetch(baseURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({
      sl: 'auto',
      tl: inputTo,
      q: inputMessage.content,
    }).toString(),
  });

  if (response.status !== 200)
    return await interaction.editReply({
      content: client.i18n.t('commands.translate.can_not_translate', { lng: inputTo }),
      flags: { ephemeral: true } as any,
    });

  const data = await response.json();
  const source = data.src;
  const sentences = data.sentences;
  const translate = sentences.find((sentence: any) => 'trans' in sentence)?.trans;
  const transliteration = sentences.find(
    (sentence: any) => 'src_translit' in sentence,
  )?.src_translit;

  if (!translate)
    return await interaction.editReply({
      content: client.i18n.t('commands.translate.can_not_translate', { lng: inputTo }),
      flags: { ephemeral: true } as any,
    });

  const userUsername = interaction.user.username;
  const userAvatar = interaction.user.avatarURL();
  const translateEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTimestamp()
    .setDescription(
      `\`\`\`${translate}\`\`` + (transliteration ? `\n> ${transliteration}` : ''),
    )
    .setAuthor({
      iconURL: userAvatar || undefined,
      name: `${userUsername} ${client.i18n.t('commands.translate.says', { lng: inputTo })}`,
    })
    .setFooter({
      text: `[${source}] -> [${inputTo}]`,
    });

  await interaction.editReply({ embeds: [translateEmbed], flags: { ephemeral: true } as any });
}
