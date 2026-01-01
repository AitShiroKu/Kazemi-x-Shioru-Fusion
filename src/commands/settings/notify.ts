import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

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
  const client = interaction.client as any;
  const subcommand = interaction.options.getSubcommand();

  const db = client.database;
  const notifyRef = db.ref(`guilds/${interaction.guildId}/notify`);
  const notifySnapshot = await notifyRef.get();

  const notifyData: Record<string, { enable: boolean }> =
    (notifySnapshot.val() as Record<string, { enable: boolean }> | null) || {
    message: { enable: true },
    join: { enable: true },
    leave: { enable: true },
    ban: { enable: true },
    kick: { enable: true },
    member: { enable: true },
    role: { enable: true },
  };

  switch (subcommand) {
    case 'list':
      const listEmbed = new EmbedBuilder()
        .setTitle('Notification Settings')
        .setDescription('Available notification types: message, join, leave, ban, kick, member, role')
        .setColor(Colors.Blue)
        .setTimestamp();

      const enabledList = Object.entries(notifyData)
        .filter(([, value]) => value.enable)
        .map(([key, value]) => `• ${key}: ${value.enable ? 'enabled' : 'disabled'}`)
        .join('\n');

      listEmbed.setDescription(enabledList || 'No notifications configured.');

      await interaction.reply({ embeds: [listEmbed] });
      break;
    case 'enable': {
      const typeKey = interaction.options.getString('type') || 'message';
      if (!notifyData[typeKey])
        return await interaction.reply(`Notification type '${typeKey}' not found.`);

      notifyData[typeKey].enable = true;
      await notifyRef.set(notifyData);

      await interaction.reply(`Enabled ${typeKey} notifications.`);
      break;
    }
    case 'disable': {
      const typeKey = interaction.options.getString('type') || 'message';
      if (!notifyData[typeKey])
        return await interaction.reply(`Notification type '${typeKey}' not found.`);

      notifyData[typeKey].enable = false;
      await notifyRef.set(notifyData);

      await interaction.reply(`Disabled ${typeKey} notifications.`);
      break;
    }
  }
}
