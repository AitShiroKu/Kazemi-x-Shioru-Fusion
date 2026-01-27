import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { debug } from "../logger/logger.js";
import logger from "../logger/logger.js";
export type MemoryRole = "system" | "user" | "model";

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
      debug(
        "Cleaned up old history for user",
        {
          userId,
          daysInactive: Math.round(
            (now - userMemory.lastActivity) / (24 * 60 * 60 * 1000),
          ),
        },
        "memory",
      );
    }
  }
  return memory;
};

export const loadMemory = (): MemoryData => {
  try {
    if (!existsSync("data")) {
      debug("Creating data directory", {}, "memory");
      mkdirSync("data", { recursive: true });
    }
    if (!existsSync("data/memory.json")) {
      debug("Creating new memory file", {}, "memory");
      writeFileSync("data/memory.json", JSON.stringify({}, null, 2), "utf-8");
      return {};
    }
    const memory = JSON.parse(
      readFileSync("data/memory.json", "utf-8"),
    ) as MemoryData;
    return cleanupOldHistory(memory);
  } catch (err) {
    logger.error({ error: err }, "Error loading memory");
    return {};
  }
};

export const saveMemory = (memory: MemoryData): void => {
  try {
    if (!existsSync("data")) {
      debug("Creating data directory", {}, "memory");
      mkdirSync("data", { recursive: true });
    }
    writeFileSync("data/memory.json", JSON.stringify(memory, null, 2), "utf-8");
    debug(
      "Memory saved successfully",
      { memorySize: Object.keys(memory).length },
      "memory",
    );
  } catch (err) {
    logger.error({ error: err }, "Error saving memory");
  }
};
