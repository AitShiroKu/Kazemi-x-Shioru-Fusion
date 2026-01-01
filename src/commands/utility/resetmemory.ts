import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { loadMemory, saveMemory } from '../../utils/memory.js';
import type { MemoryData } from '../../utils/memory.js';

export const data = new SlashCommandBuilder()
  .setName('resetmemory')
  .setDescription('รีเซ็ตความทรงจำของคุณกับบอท');

export async function execute(interaction: ChatInputCommandInteraction) {
  const userId = interaction.user.id;
  const username = interaction.user.globalName || interaction.user.username;
  const userConversations: MemoryData = loadMemory();

  userConversations[userId] = {
    username,
    lastActivity: new Date().getTime(),
    history: [],
    createdAt: new Date().getTime(),
  };
  saveMemory(userConversations);

  await interaction.reply({
    content: '🧠 ความทรงจำของเกี่ยวกับคุณถูกรีเซ็ตเรียบร้อยแล้ว!',
    ephemeral: true,
  });
}

export default { data, execute };
