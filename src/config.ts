import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const config = JSON.parse(readFileSync('./config.json', 'utf-8')) as any;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_MODEL: string = process.env.GEMINI_MODEL || config?.gemini?.model || 'gemini-2.5-flash';
export const GEMINI_TEMPERATURE: number = Number(process.env.GEMINI_TEMPERATURE ?? config?.gemini?.temperature ?? 0.7);
export const GEMINI_MAX_OUTPUT_TOKENS: number = Number(process.env.GEMINI_MAX_OUTPUT_TOKENS ?? config?.gemini?.maxOutputTokens ?? 1024);
export const DEBUG_MODE: boolean = (process.env.DEBUG_MODE === 'true') || config?.debugMode || false;

// Load configuration files
console.log('Loading configuration files...');
console.log('GEMINI_MODEL:', GEMINI_MODEL);
console.log('GEMINI_TEMPERATURE:', GEMINI_TEMPERATURE);
console.log('GEMINI_MAX_OUTPUT_TOKENS:', GEMINI_MAX_OUTPUT_TOKENS);
console.log('DEBUG_MODE:', DEBUG_MODE);

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const SUPPORT_URL = process.env.SUPPORT_URL;

export default config;
