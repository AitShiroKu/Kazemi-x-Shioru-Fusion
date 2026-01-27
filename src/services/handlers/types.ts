/**
 * Unified Type System for Discord Bot Fusion
 * Kazemi x Shioru Integration
 */

import {
  Collection,
  Client,
  SlashCommandBuilder,
  ContextMenuCommandBuilder,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  PermissionResolvable,
} from "discord.js";
import type pino from "pino";

// ============================================================================
// Bot Client Types
// ============================================================================

export interface BotClient extends Client {
  commands: Collection<string, Command>;
  contexts: Collection<string, Context>;
  cooldowns: Collection<string, Collection<string, number>>;
  player: any;
  i18n: any;
  mode?: string;
  logger: pino.Logger;
  configs: BotConfig;
  temp: TempData;
  userConversations: MemoryData;
  saveMemory: (memory: MemoryData) => void;
  formatBotReply?: (text: string) => string;
  splitMessageWithCodeBlocks?: (
    text: string,
  ) => Array<{ text: string; attachment?: { content: string; name: string } }>;
  // Database functions (stubs for removed Firebase integration)
  initializeData?: (guild: any) => Promise<void>;
  submitNotification?: (
    guild: any,
    eventName: string,
    embed: any,
  ) => Promise<void>;
}

export interface TempData {
  startup: {
    start: number;
    end: number;
  };
  commands: Collection<string, Record<string, CommandInfo>>;
  contexts: Collection<string, ContextInfo>;
}

export interface CommandInfo {
  name: string;
  description: {
    "en-US": string;
    [key: string]: string;
  };
  cooldown: number;
  category: string;
  permissions: string[];
  usage?: string;
}

export interface ContextInfo {
  type: number;
  cooldown: number;
  name: string;
  permissions: string[];
}

// ============================================================================
// Command Types
// ============================================================================

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
  permissions?: PermissionResolvable[];
  cooldown?: number;
  category?: CommandCategory;
  usage?: string;
}

export interface Context {
  data: ContextMenuCommandBuilder;
  execute: (interaction: ContextMenuCommandInteraction) => Promise<void> | void;
  permissions?: PermissionResolvable[];
  cooldown?: number;
}

export enum CommandCategory {
  DEVELOPER = "DEVELOPER",
  FUN = "FUN",
  INFORMATION = "INFORMATION",
  MANAGER = "MANAGER",
  ME = "ME",
  MESSAGES = "MESSAGES",
  MUSIC = "MUSIC",
  SETTINGS = "SETTINGS",
  UTILITY = "UTILITY",
}

// ============================================================================
// Event Types
// ============================================================================

export interface Event {
  name: string;
  once: boolean;
  execute: (...args: any[]) => Promise<void> | void;
}

// ============================================================================
// AI & Memory Types (from Kazemi)
// ============================================================================

export interface MemoryData {
  [userId: string]: UserMemory;
}

export interface UserMemory {
  username: string;
  language?: string;
  lastActivity: number;
  history: MemoryMessage[];
  createdAt: number;
}

export interface MemoryMessage {
  role: "system" | "user" | "model";
  content: string;
  timestamp: number;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxOutputTokens: number;
}

export interface ThinkingStep {
  step: string;
  timestamp: number;
}

// ============================================================================
// Embed Types
// ============================================================================

export enum EmbedColor {
  // Success Colors
  SUCCESS = 0x57f287, // Green
  INFO = 0x5865f2, // Blue
  // Warning Colors
  WARNING = 0xfee75c, // Yellow
  // Error Colors
  ERROR = 0xed4245, // Red
  // Category Colors
  MUSIC = 0x5865f2, // Blue
  FUN = 0xeb459e, // Pink
  UTILITY = 0x57f287, // Green
  MANAGER = 0xed4245, // Red
  INFORMATION = 0x5865f2, // Blue
  DEVELOPER = 0x5865f2, // Blue
  ME = 0x5865f2, // Blue
  MESSAGES = 0x5865f2, // Blue
  SETTINGS = 0x5865f2, // Blue
  // AI Colors (from Kazemi - Kuniko theme)
  AI_DEFAULT = 0xffb6c1, // Light Pink
  AI_THINKING = 0x9370db, // Purple
  AI_ERROR = 0xed4245, // Red
}

export interface EmbedOptions {
  title?: string;
  description?: string;
  color?: EmbedColor | number;
  fields?: EmbedField[];
  author?: { name: string; iconURL?: string };
  footer?: { text: string; iconURL?: string };
  thumbnail?: string;
  image?: string;
  timestamp?: boolean;
}

export interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

// ============================================================================
// Config Types
// ============================================================================

export interface BotConfig {
  token: string;
  clientId: string;
  gemini: GeminiConfig;
  firebase: FirebaseConfig;
  music: MusicConfig;
  i18n: I18nConfig;
  filters: string[];
  logger: LoggerConfig;
  debug: DebugConfig;
  monitoring: MonitoringConfig;
  openai: OpenAIConfig;
  openWeatherToken?: string;
  translation: TranslationConfig;
  testGuild?: string;
  emulators: EmulatorConfig;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface MusicConfig {
  leaveOnEmpty: boolean;
  leaveOnStop: boolean;
  leaveOnEnd: boolean;
  filters?: string[];
}

export interface I18nConfig {
  defaultLocale: string;
  fallbackLocale: string;
}

export interface LoggerConfig {
  [key: string]: {
    enable: boolean;
    webhookURL?: string;
  };
}

export interface DebugConfig {
  enable: boolean;
  fileLogging: boolean;
  consoleLogging: boolean;
  webhookURL: string;
  logLevel: string;
}

export interface MonitoringConfig {
  apiKey?: string;
  metricId?: string;
  pageId?: string;
}

export interface OpenAIConfig {
  apiKey?: string;
}

export interface TranslationConfig {
  baseURL: string;
}

export interface EmulatorConfig {
  database: {
    host: string;
    port: number;
  };
}

// ============================================================================
// Database Types
// ============================================================================

export interface GuildData {
  id: string;
  language?: string;
  notify?: NotifyConfig;
  djs?: DJConfig;
  level?: LevelConfig;
  captcha?: CaptchaConfig;
  antibot?: boolean;
}

export interface NotifyConfig {
  [key: string]: {
    channel?: string;
    content?: string;
    embed?: any;
    enable?: boolean;
  };
}

export interface DJConfig {
  enable: boolean;
  roles: string[];
  users: string[];
}

export interface LevelConfig {
  enable: boolean;
  multiplier: number;
}

export interface CaptchaConfig {
  enable: boolean;
  channel?: string;
  role?: string;
}

export interface UserData {
  id: string;
  exp?: number;
  level?: number;
  afk?: {
    status: boolean;
    reason?: string;
    startTime: number;
  };
}

// ============================================================================
// Music Types
// ============================================================================

export interface QueueData {
  songs: Song[];
  previousSongs: Song[];
  autoplay?: boolean;
  filter?: string[];
}

export interface Song {
  name: string;
  url: string;
  duration: number;
  thumbnail?: string;
  user: {
    id: string;
    username: string;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export type InteractionResponse = {
  content?: string;
  embeds?: any[];
  components?: any[];
  files?: any[];
  ephemeral?: boolean;
};

export type ColorResolvable = number | string;
