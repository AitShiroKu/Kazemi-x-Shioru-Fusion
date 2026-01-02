/**
 * Configuration Service
 * Kazemi x Shioru Fusion
 */

import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import type { BotConfig } from '../../handlers/types.js';

dotenv.config();

const configJson = JSON.parse(readFileSync('./config.json', 'utf-8'));

export const config: BotConfig = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.CLIENT_ID || '',
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || configJson.gemini?.apiKey || '',
    model: process.env.GEMINI_MODEL || configJson.gemini?.model || 'gemini-2.0-flash-exp',
    temperature: Number(process.env.GEMINI_TEMPERATURE ?? configJson.gemini?.temperature ?? 0.7),
    maxOutputTokens: Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? configJson.gemini?.maxOutputTokens ?? 8192),
  },
  firebase: {
    apiKey: process.env.API_KEY || '',
    authDomain: process.env.AUTH_DOMAIN || '',
    databaseURL: process.env.DATABASE_URL || '',
    projectId: process.env.PROJECT_ID || '',
    storageBucket: process.env.STORAGE_BUCKET || '',
    messagingSenderId: process.env.MESSAGING_SENDER_ID || '',
    appId: process.env.APP_ID || '',
    measurementId: process.env.MEASUREMENT_ID || '',
  },
  music: {
    leaveOnEmpty: true,
    leaveOnStop: false,
    leaveOnEnd: false,
  },
  i18n: {
    defaultLocale: 'th',
    fallbackLocale: 'en-US',
  },
  filters: configJson.filters || [],
  logger: configJson.logger || {},
  monitoring: {
    apiKey: process.env.MONITOR_API_KEY || '',
    metricId: process.env.MONITOR_METRIC_ID || '',
    pageId: process.env.MONITOR_PAGE_ID || '',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY || configJson.openai?.apiKey || '',
  },
  openWeatherToken: process.env.OPEN_WEATHER_TOKEN || configJson.open_weather_token || '',
  translation: {
    baseURL: process.env.TRANSLATION_BASE_URL || configJson.translation?.baseURL || '',
  },
  testGuild: process.env.TEST_GUILD || configJson.test_guild || '',
  emulators: {
    database: {
      host: configJson.emulators?.database?.host || 'localhost',
      port: configJson.emulators?.database?.port || 9000,
    },
  },
};

export default config;
export const DISCORD_TOKEN = config.token;
export const SUPPORT_URL = process.env.SUPPORT_URL || '';
export const SYSTEM_PROMPT = process.env.SYSTEM_PROMPT || configJson.systemMessage?.prompt || '';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL: string = process.env.GEMINI_MODEL || config?.gemini?.model || 'gemini-2.5-flash';
export const GEMINI_TEMPERATURE: number = Number(process.env.GEMINI_TEMPERATURE ?? config?.gemini?.temperature ?? 0.7);
export const GEMINI_MAX_OUTPUT_TOKENS: number = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? config?.gemini?.maxOutputTokens ?? 1024);
export const DEBUG_MODE: boolean = process.env.DEBUG_MODE === 'true' || false;

// Validate required configuration
if (!config.token) {
  console.error('❌ ERROR: DISCORD_TOKEN is required in .env file');
  process.exit(1);
}

if (!config.gemini.apiKey) {
  console.warn('⚠️  WARNING: GEMINI_API_KEY is not set. AI features will not work.');
}


console.log('✅ Configuration loaded successfully');
