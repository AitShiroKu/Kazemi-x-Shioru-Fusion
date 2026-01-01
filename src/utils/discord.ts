import {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type Message,
  AttachmentBuilder,
} from 'discord.js';
import { loadMemory, saveMemory, type MemoryData, type UserMemory } from './memory.js';
import { geminiResponse } from './gemini.js';
import { formatBotReply, splitMessageWithCodeBlocks } from './utils.js';
import dotenv from 'dotenv';
import { GEMINI_MODEL } from '../config.js';
dotenv.config();

// Set up Discord Bot with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Load memory from file
const userConversations: MemoryData = loadMemory();

const generateInviteLink = () => {
  const permissions = new PermissionsBitField([
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.ManageMessages,
    PermissionsBitField.Flags.ReadMessageHistory,
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.AddReactions,
    PermissionsBitField.Flags.UseExternalEmojis,
    PermissionsBitField.Flags.Connect,
    PermissionsBitField.Flags.Speak,
  ]);
  return `https://discord.com/oauth2/authorize?client_id=${client.user!.id}&permissions=${permissions.bitfield}&scope=bot`;
};

client.once('ready', () => {
  console.log(`✅ บอทล็อกอินเป็น ${client.user!.tag}`);
  console.log(`🔗 เชิญบอทเข้าร่วมเซิร์ฟเวอร์: ${generateInviteLink()}`);
  console.log(`🌐 กําลังใช้งานใน ${client.guilds.cache.size} เซิร์ฟเวอร์`);
  console.log(`🚀 กำลังใช้งาน Model ${GEMINI_MODEL}`);
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const username = message.author.globalName || message.author.username;

  // Initialize userMemory at the start
  let userMemory: UserMemory = userConversations[userId] || {
    username,
    language: 'root',
    lastActivity: Date.now(),
    history: [],
    createdAt: Date.now(),
  };

const SUPPORT_URL = process.env.SUPPORT_URL;

  // คำสั่งรีเซ็ตความทรงจำ

  const isStartCommand = message.content.toLowerCase().startsWith('!chat');
  const isReply = message.reference?.messageId;

  const BelowButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setLabel('Support').setEmoji('📝').setStyle(ButtonStyle.Link).setURL(SUPPORT_URL || 'https://example.com'),
    new ButtonBuilder().setLabel('Invite Me').setEmoji('🌸').setStyle(ButtonStyle.Link).setURL(generateInviteLink())
  );

  // ถ้าเป็นคำสั่งเริ่มต้น !chat
  if (isStartCommand) {
    const prompt = message.content.slice(5).trim(); // ตัด "!chat" ออก
    if (!prompt) {
      await message.reply({
        content: formatBotReply(
          `💬 สวัสดีค่ะ! คุณ ${username} ตอบกลับข้อความของหนู พร้อมข้อความ เพื่อเริ่มสนทนาได้เลยนะคะ 💖🌸`
        ),
        components: [BelowButton],
      });
      return;
    }

    const response = await geminiResponse(prompt, userId, username, userConversations, saveMemory);
    const messageSegments = splitMessageWithCodeBlocks(response);
    for (const segment of messageSegments) {
      const replyOptions: any = {
        content: formatBotReply(segment.text),
        components: [BelowButton],
      };

      if (segment.attachment) {
        const attachment = new AttachmentBuilder(
          Buffer.from(segment.attachment.content, 'utf-8'),
          { name: segment.attachment.name }
        );
        replyOptions.files = [attachment];
      }

      await message.reply(replyOptions);
    }
    return;
  }

  // ถ้าเป็นการตอบกลับข้อความ
  if (isReply) {
    try {
      const repliedMessage = await message.channel.messages
        .fetch(message.reference!.messageId as string)
        .catch(() => null);
      if (!repliedMessage || repliedMessage.author.id !== client.user!.id) return;

      const response = await geminiResponse(message.content, userId, username, userConversations, saveMemory);
      const messageSegments = splitMessageWithCodeBlocks(response);


      for (const segment of messageSegments) {
        const replyOptions: any = {
          content: formatBotReply(segment.text),
          components: [BelowButton]
        };

        if (segment.attachment) {
          const attachment = new AttachmentBuilder(
            Buffer.from(segment.attachment.content, 'utf-8'),
            { name: segment.attachment.name }
          );
          replyOptions.files = [attachment];
        }

        await message.reply(replyOptions);
      }
    } catch (error) {
      console.error('Error in message handling:', error);
      await message.reply({
        content: formatBotReply('❌ ขออภัยค่ะ เกิดข้อผิดพลาดในการประมวลผล'),
        components: [BelowButton],
      });
    }
  }
});

export function startBot() {
    client.login(process.env.DISCORD_TOKEN);
} 
