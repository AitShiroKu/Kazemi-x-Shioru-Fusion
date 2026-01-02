import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../services/handlers/types.js';

export const data = new SlashCommandBuilder()
  .setName('afk')
  .setDescription('Go AFK within your server.')
  .setDescriptionLocalizations({
    th: 'ไป AFK ภายในเซิร์เวอร์ของคุณ',
  })
  .setContexts([
    InteractionContextType.Guild,
    InteractionContextType.PrivateChannel,
  ])
  .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
  .addSubcommand((subcommand) =>
    subcommand
      .setName('set')
      .setDescription('Set your status to AFK.')
      .setDescriptionLocalizations({
        th: 'ตั้งสถานะของคุณเป็น AFK',
      })
      .addStringOption((option) =>
        option
          .setName('message')
          .setDescription('The reason you will be AFK.')
          .setDescriptionLocalizations({
            th: 'เหตุผลที่คุณจะไม่อยู่ที่หน้าจอ (AFK)',
          })
          .setRequired(false),
      ),
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName('remove')
      .setDescription('Unset your status to AFK.')
      .setDescriptionLocalizations({
        th: 'ยกเลิกตั้งสถานะของคุณเป็น AFK',
      }),
  );

export const permissions = [
  PermissionFlagsBits.SendMessages,
  PermissionFlagsBits.ChangeNickname,
];
export const category = 'manager';

// Simple in-memory storage for AFK status
const afkStorage = new Map<
  string,
  { message: string; nickname: string; timestamp: number }
>();

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();
  const inputMessage = interaction.options.getString('message') ?? '';

  const client = interaction.client as any;
  const i18n = client.i18n.t;

  if (!interaction.guild) {
    return await interaction.reply(i18n('commands.afk.guild_only'));
  }

  const member = interaction.member as any;
  const nickname = member?.nickname || interaction.user.username;
  const userId = interaction.user.id;

  switch (subcommand) {
    case 'set': {
      const currentAfk = afkStorage.get(userId);
      if (currentAfk) {
        return await interaction.reply({
          content: i18n('commands.afk.currently_afk'),
          ephemeral: true,
        });
      }

      // Store AFK status
      afkStorage.set(userId, {
        message: inputMessage,
        nickname: nickname,
        timestamp: Date.now(),
      });

      try {
        await member?.edit({ nick: `[AFK] ${nickname}` });
      } catch (error) {
        console.error('Error setting nickname:', error);
      }

      await interaction.reply({
        content: i18n('commands.afk.now_afk'),
        ephemeral: true,
      });
      break;
    }
    case 'remove': {
      const currentAfk = afkStorage.get(userId);
      if (!currentAfk) {
        return await interaction.reply({
          content: i18n('commands.afk.currently_not_afk'),
          ephemeral: true,
        });
      }

      try {
        await member?.edit({ nick: currentAfk.nickname });
      } catch (error) {
        console.error('Error restoring nickname:', error);
      }

      afkStorage.delete(userId);
      await interaction.reply({
        content: i18n('commands.afk.now_not_afk'),
        ephemeral: true,
      });
      break;
    }
  }
}
