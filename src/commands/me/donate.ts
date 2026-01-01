import {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('donate')
  .setDescription(
    'Support me and my host to help with utilities bills by making a donation.',
  )
  .setDescriptionLocalizations({
    th: 'สนับสนุนฉันและเจ้าบ้านเพื่อช่วยเหลือค่าน้ำค่าไฟด้วยการบริจาค',
  })
  .setDefaultMemberPermissions(null)
  .setContexts([
    InteractionContextType.BotDM,
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ]);

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.EmbedLinks,
];
export const category = 'me';

export async function execute(interaction: ChatInputCommandInteraction) {
  const client = interaction.client as any;
  const i18n = client.i18n.t;

  const githubBtn = new ButtonBuilder()
    .setURL('https://github.com/sponsors/Maseshi')
    .setLabel('Github')
    .setStyle(ButtonStyle.Link);
  const patreonBtn = new ButtonBuilder()
    .setURL('https://www.patreon.com/Maseshi')
    .setLabel('Patreon')
    .setStyle(ButtonStyle.Link);
  const buymeBtn = new ButtonBuilder()
    .setURL('https://www.buymeacoffee.com/Maseshi')
    .setLabel('Buy me a green tea')
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder() as any;
  row.setComponents([githubBtn, patreonBtn, buymeBtn]);

  await interaction.reply({
    content: i18n('commands.donate.thank_you_in_advance'),
    components: [row],
  });
}
