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
  .setName('notify')
  .setDescription('Set up notifications you want.')
  .setDescriptionLocalizations({ th: 'ตั้งค่าการแจ้งเตือนที่คุณต้องการ' })
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('list')
      .setDescription('See a list of currently supported notifications.')
      .setDescriptionLocalizations({
        th: 'ดูรายการแจ้งเตือนที่รองรับในขณะนี้',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('enable')
      .setDescription('Enable notifications based on desired events.')
      .setDescriptionLocalizations({
        th: 'เปิดใช้งานการแจ้งเตือนที่ต้องการณ์ที่ต้องการ',
      }),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('disable')
      .setDescription('Temporarily turn off specific notifications.')
      .setDescriptionLocalizations({
        th: 'ปิดการแจ้งเตือนที่ต้องการชั่วคราว',
      }),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'settings';

export async function execute(interaction: ChatInputCommandInteraction) {
  const unavailableEmbed = new EmbedBuilder()
    .setTitle('⚠️ Feature Unavailable')
    .setDescription('The notification system is currently unavailable as the database integration has been removed.')
    .setColor(Colors.Yellow)
    .setTimestamp();

  await interaction.reply({ embeds: [unavailableEmbed], ephemeral: true });
}
