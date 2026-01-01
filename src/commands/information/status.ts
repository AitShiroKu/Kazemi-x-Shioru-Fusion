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
  .setName('status')
  .setDescription('Check the status of all members in the server.')
  .setDescriptionLocalizations({
    th: 'ตรวจสอบสถานะของสมาชิกทั้งหมดในเซิร์ฟเวอร์',
  })
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([
    ApplicationIntegrationType.GuildInstall,
    ApplicationIntegrationType.UserInstall,
  ])
  .addStringOption((option) =>
    option
      .setName('type')
      .setDescription('The status you want to check.')
      .setDescriptionLocalizations({ th: 'สถานะที่คุณต้องการตรวจสอบ' })
      .setRequired(true)
      .addChoices(
        { name: 'Online', value: 'online' },
        { name: 'Offline', value: 'offline' },
        { name: 'Idle', value: 'idle' },
        { name: 'Do Not Disturb', value: 'dnd' },
      ),
  );

export const permissions = [PermissionFlagsBits.SendMessages];
export const category = 'information';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputType = interaction.options.getString('type')!;

  if (!interaction.guild)
    return await interaction.reply(
      (interaction.client as any).i18n.t('commands.status.guild_only'),
    );

  const guildIcon = interaction.guild.iconURL();
  const statusEmbed = new EmbedBuilder()
    .setTimestamp()
    .setFooter({
      text: (interaction.client as any).i18n.t('commands.status.data_by_server'),
      iconURL: guildIcon || undefined,
    });

  switch (inputType) {
    case 'online': {
      const onlineCount = interaction.guild.members.cache.filter(
        (members) =>
          members.presence ? members.presence.status === 'online' : false,
      ).size;

      statusEmbed
        .setDescription(
          (interaction.client as any)
            .i18n.t('commands.status.online_status')
            .replace('%s', onlineCount.toString()),
        )
        .setColor(Colors.Green);
      await interaction.reply({ embeds: [statusEmbed] });
      break;
    }
    case 'offline': {
      const offlineCount = interaction.guild.members.cache.filter(
        (members) =>
          members.presence
            ? members.presence.status === 'offline'
            : !members.presence,
      ).size;

      statusEmbed
        .setDescription(
          (interaction.client as any)
            .i18n.t('commands.status.offline_status')
            .replace('%s', offlineCount.toString()),
        )
        .setColor(Colors.Grey);
      await interaction.reply({ embeds: [statusEmbed] });
      break;
    }
    case 'idle': {
      const idleCount = interaction.guild.members.cache.filter(
        (members) =>
          members.presence ? members.presence.status === 'idle' : false,
      ).size;

      statusEmbed
        .setDescription(
          (interaction.client as any)
            .i18n.t('commands.status.idle_status')
            .replace('%s', idleCount.toString()),
        )
        .setColor(Colors.Yellow);
      await interaction.reply({ embeds: [statusEmbed] });
      break;
    }
    case 'dnd': {
      const dndCount = interaction.guild.members.cache.filter(
        (members) =>
          members.presence ? members.presence.status === 'dnd' : false,
      ).size;

      statusEmbed
        .setDescription(
          (interaction.client as any)
            .i18n.t('commands.status.dnd_status')
            .replace('%s', dndCount.toString()),
        )
        .setColor(Colors.Red);
      await interaction.reply({ embeds: [statusEmbed] });
      break;
    }
  }
}
