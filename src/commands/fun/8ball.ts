/**
 * 8ball Command
 * Ask magic 8-ball a question
 * Converted from Shioru/source/commands/fun/8ball.js
 */

import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ChatInputCommandInteraction,
} from 'discord.js';
import type { Command } from '../../types/index.js';

export const data = new SlashCommandBuilder()
  .setName('8ball')
  .setDescription('8ball game')
  .setDescriptionLocalizations({ th: 'เกม 8ball' })
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
      .setName('question')
      .setDescription('This will be your question for 8ball.')
      .setDescriptionLocalizations({ th: 'นี่จะเป็นคำถามของคุณสำหรับ 8ball' })
      .setRequired(true),
  );

export const permissions = [];
export const category = 'fun';

export async function execute(interaction: ChatInputCommandInteraction) {
  const inputQuestion = interaction.options.getString('question');

  const choices = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
  ];

  const ball = Math.floor(Math.random() * choices.length);

  const memberAvatar = interaction.user?.displayAvatarURL() || '';
  const memberName = interaction.user?.username || 'Unknown';
  const eightBallEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle('🎱 8-Ball')
    .setDescription('🎱 Ask me anything and I will answer!')
    .setAuthor({ iconURL: memberAvatar, name: memberName })
    .setFields([
      {
        name: '🎱 Question',
        value: inputQuestion ?? '',
        inline: true,
      },
    ]);

  const eightBallButton = new ActionRowBuilder<any>().addComponents(
    new ButtonBuilder()
      .setCustomId('8ball-button')
      .setLabel('🎲 Roll 8-Ball!')
      .setStyle(ButtonStyle.Primary),
  );

  const message = await interaction.reply({
    embeds: [eightBallEmbed],
    components: [eightBallButton],
  });

  const collector = (message as any).createMessageComponentCollector();

  collector.on('collect', async (component: any) => {
    if (component.customId === '8ball-button') {
      eightBallEmbed.addFields({
        name: '🎱 Answer',
        value: choices[ball],
        inline: true,
      });
      component.update({ embeds: [eightBallEmbed], components: [] });
    }
  });
}

export default { data, execute, permissions, category };
