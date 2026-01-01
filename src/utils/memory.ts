import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
export type MemoryRole = 'system' | 'user' | 'model';

export interface MemoryMessage {
  role: MemoryRole;
  content: string;
  timestamp: number;
}

export interface UserMemory {
  username: string;
  language?: string;
  lastActivity: number;
  history: MemoryMessage[];
  createdAt: number;
}

export type MemoryData = Record<string, UserMemory>;

// ฟังก์ชันสำหรับตรวจสอบและลบประวัติเก่า
const cleanupOldHistory = (memory: MemoryData): MemoryData => {
  const THREE_DAYS = 3 * 24 * 60 * 60 * 1000; // 3 วันในหน่วยมิลลิวินาที
  const now = Date.now();

  for (const userId in memory) {
    const userMemory = memory[userId];
    if (now - userMemory.lastActivity > THREE_DAYS) {
      // ลบประวัติเก่าที่เกิน 3 วัน
      delete memory[userId];
      console.log(`Cleaned up old history for user ${userId}`);
    }
  }
  return memory;
};

export const loadMemory = (): MemoryData => {
  try {
    if (!existsSync('data/memory.json')) {
      console.log('Creating new memory file');
      writeFileSync('data/memory.json', JSON.stringify({}, null, 2), 'utf-8');
      return {};
    }
    const memory = JSON.parse(readFileSync('data/memory.json', 'utf-8')) as MemoryData;
    return cleanupOldHistory(memory);
  } catch (err) {
    console.error('Error loading memory:', err);
    return {};
  }
};

export const saveMemory = (memory: MemoryData): void => {
  try {
    if (!existsSync('data')) {
      console.log('Creating data directory');
      mkdirSync('data');
    }
    writeFileSync('data/memory.json', JSON.stringify(memory, null, 2), 'utf-8');
    console.log('Memory saved successfully');
  } catch (err) {
    console.error('Error saving memory:', err);
  }
};
