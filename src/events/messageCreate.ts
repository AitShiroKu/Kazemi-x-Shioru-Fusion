import {
  Message,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
  AttachmentBuilder,
} from 'discord.js';
import { geminiResponse } from '../utils/gemini.js';
import { splitMessageWithCodeBlocks, formatBotReply } from '../utils/utils.js';

export const name = Events.MessageCreate;
export const once = false;

export async function execute(client: any, message: Message) {
  if (message.author.bot) return;

  const userId = message.author.id;
  const username = message.author.globalName || message.author.username;

  // Initialize userMemory at start
  let userMemory = client.userConversations?.[userId] || {
    username,
    language: 'th',
    lastActivity: Date.now(),
    history: [],
    createdAt: Date.now(),
  };

  const SUPPORT_URL = process.env.SUPPORT_URL;

  // Check if it's a chat command or reply
  const isStartCommand = message.content.toLowerCase().startsWith('!chat');
  const isReply = message.reference?.messageId;

  // Create support buttons
  const supportButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel('Support')
      .setEmoji('📝')
      .setStyle(ButtonStyle.Link)
      .setURL(SUPPORT_URL || 'https://example.com'),
    new ButtonBuilder()
      .setLabel('Invite Me')
      .setEmoji('🌸')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8`),
  );

  // Handle !chat command
  if (isStartCommand) {
    const prompt = message.content.slice(5).trim(); // Remove "!chat"
    if (!prompt) {
      await message.reply({
        content: `💬 สวัสดีค่ะ! คุณ ${username} ตอบกับข้อความของหนู่พร้อมข้อความ เพื่อเริ่มสนทนาได้เลยนะคะ 💖🌸`,
        components: [supportButton],
      });
      return;
    }

    const response = await geminiResponse(prompt, userId, username, client.userConversations, client.saveMemory);
    const messageSegments = splitMessageWithCodeBlocks(response);

    for (let i = 0; i < messageSegments.length; i++) {
      const segment = messageSegments[i];

      const embed = new EmbedBuilder()
        .setColor(0xE91E63) // Premium Pink
        .setDescription(client.formatBotReply?.(segment.text) || segment.text)
        .setTimestamp()
        .setFooter({
          text: `Conversation with ${username} | Gemini AI`,
          iconURL: message.author.displayAvatarURL()
        });

      const replyOptions: any = {
        embeds: [embed],
        components: i === messageSegments.length - 1 ? [supportButton] : [],
      };

      if (segment.attachment) {
        const attachment = new AttachmentBuilder(
          Buffer.from(segment.attachment.content, 'utf-8'),
          { name: segment.attachment.name },
        );
        replyOptions.files = [attachment];
      }

      if (i === 0 && !segment.noReply) {
        await message.reply(replyOptions);
      } else {
        await (message.channel as any).send(replyOptions);
      }
    }
    return;
  }

  // Handle reply to bot message
  if (isReply) {
    try {
      const repliedMessage = await message.channel.messages
        .fetch(message.reference!.messageId as string)
        .catch(() => null);

      if (!repliedMessage || repliedMessage.author.id !== client.user.id) return;

      const response = await geminiResponse(message.content, userId, username, client.userConversations, client.saveMemory);
      const messageSegments = splitMessageWithCodeBlocks(response);

      for (let i = 0; i < messageSegments.length; i++) {
        const segment = messageSegments[i];

        const embed = new EmbedBuilder()
          .setColor(0xE91E63) // Premium Pink
          .setDescription(client.formatBotReply?.(segment.text) || segment.text)
          .setTimestamp()
          .setFooter({
            text: `Conversation with ${username} | Gemini AI`,
            iconURL: message.author.displayAvatarURL()
          });

        const replyOptions: any = {
          embeds: [embed],
          components: i === messageSegments.length - 1 ? [supportButton] : [],
        };

        if (segment.attachment) {
          const attachment = new AttachmentBuilder(
            Buffer.from(segment.attachment.content, 'utf-8'),
            { name: segment.attachment.name },
          );
          replyOptions.files = [attachment];
        }

        if (i === 0 && !segment.noReply) {
          await message.reply(replyOptions);
        } else {
          await (message.channel as any).send(replyOptions);
        }
      }
    } catch (error) {
      client.logger.error('Error in message handling:', error);

      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setDescription('❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล');

      await message.reply({
        embeds: [errorEmbed],
        components: [supportButton],
      });
    }
  }

  client.logger.debug('MessageCreate event completed');
}
