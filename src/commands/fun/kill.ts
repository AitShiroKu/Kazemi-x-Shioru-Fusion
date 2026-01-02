/**
 * Kill Command
 * Fake messages that say you will kill something
 * Converted from Shioru/source/commands/fun/kill.js
 */

import {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('kill')
  .setDescription('Fake messages that say you will kill something.')
  .setDescriptionLocalizations({
    th: 'ข้อความปลอมที่บอกว่าคุณฆ่าตัวตาย',
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
      .setName('name')
      .setDescription('The name of what you are about to kill.')
      .setDescriptionLocalizations({ th: 'ชื่อของสิ่งที่คุณกำลังจะฆ่า' })
      .setRequired(true),
  );

export const permissions = [];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputName = interaction.options.getString('name');

  const authorUsername = interaction.user?.username || 'Unknown';
  const clientUsername = (interaction.client as any).user?.username || 'Unknown';
  const killEmbed = new EmbedBuilder()
    .setDescription(
      (interaction.client as any).i18n.t('commands.kill.killed').replace('%s1', authorUsername)
      .replace('%s2', inputName),
    )
    .setColor(Colors.DarkRed);

  if (inputName === clientUsername) {
    return await interaction.reply(
      (interaction.client as any).i18n.t('commands.kill.do_not_kill_me'),
    );
  }

  await interaction.reply({ embeds: [killEmbed] });
}

export default { data, execute, permissions, category };
