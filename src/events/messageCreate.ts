import {
  Message,
  Partials,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import { Events } from 'discord.js';

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

    const response = await client.geminiResponse(prompt, userId, username, client.userConversations, client.saveMemory);
    const messageSegments = client.splitMessageWithCodeBlocks?.(response) || [{ text: response }];

    for (const segment of messageSegments) {
      const replyOptions: any = {
        content: segment.text,
        components: [supportButton],
      };

      if (segment.attachment) {
        const AttachmentBuilder = client.AttachmentBuilder;
        const attachment = new AttachmentBuilder(
          Buffer.from(segment.attachment.content, 'utf-8'),
          { name: segment.attachment.name },
        );
        replyOptions.files = [attachment];
      }

      await message.reply(replyOptions);
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

      const response = await client.geminiResponse(message.content, userId, username, client.userConversations, client.saveMemory);
      const messageSegments = client.splitMessageWithCodeBlocks?.(response) || [{ text: response }];

      for (const segment of messageSegments) {
        const replyOptions: any = {
          content: segment.text,
          components: [supportButton],
        };

        if (segment.attachment) {
          const AttachmentBuilder = client.AttachmentBuilder;
          const attachment = new AttachmentBuilder(
            Buffer.from(segment.attachment.content, 'utf-8'),
            { name: segment.attachment.name },
          );
          replyOptions.files = [attachment];
        }

        await message.reply(replyOptions);
      }
    } catch (error) {
      client.logger.error('Error in message handling:', error);
      await message.reply({
        content: '❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล',
        components: [supportButton],
      });
    }
  }

  client.logger.debug('MessageCreate event completed');
}
