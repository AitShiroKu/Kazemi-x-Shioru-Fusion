/**
 * Main Client Setup - Kazemi x Shioru Fusion
 * Integrates all handlers, services, and configurations
 */

import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  Collection,
} from 'discord.js';
import { DisTube } from 'distube';
import { DeezerPlugin } from '@distube/deezer';
import { YouTubePlugin } from '@distube/youtube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';

import { BotClient } from '../services/handlers/types.js';
export type { BotClient };
import { loadCommands, registerCommands } from '../services/handlers/command.js';
import { loadEvents } from '../services/handlers/event.js';
import { loadContexts } from '../services/handlers/context.js';
import { setupPlayerEvents } from '../services/handlers/player.js';
import config from '../services/config/config.js';
import logger from '../services/logger/logger.js';
import { initI18n, t } from '../services/i18n/i18n.js';
import { loadMemory, saveMemory } from '../services/memory/memory.js';
import { formatBotReply, splitMessageWithCodeBlocks } from '../utils/utils.js';

/**
 * Create a beautiful bot presence with rich activity details
 * Uses Discord's rich presence features for enhanced user experience
 */
function createBotPresence() {
  const botActivities = [
    {
      name: '/help',
      type: ActivityType.Listening,
      state: '❤️ HNY 2026🎉 | Ready to assist!',
      details: 'Type /help to see all available commands',
      timestamps: {
        start: Date.now(),
      },
      emojis: [
        {
          name: 'heart',
          id: null,
          animated: false,
        },
      ],
    },
  ];

  return {
    status: 'online' as const,
    afk: false,
    activities: botActivities,
  };
}

/**
 * Create and configure Discord client
 */
export function createClient(): BotClient {
  const client = new Client({
    partials: [
      Partials.Channel,
      Partials.GuildMember,
      Partials.GuildScheduledEvent,
      Partials.Message,
      Partials.Reaction,
      Partials.SoundboardSound,
      Partials.ThreadMember,
      Partials.User,
    ],
    presence: createBotPresence(),
    intents: [
      // Direct Messages
      GatewayIntentBits.DirectMessages,
      // Guild Expressions (Emojis, Stickers, Soundboard)
      GatewayIntentBits.GuildExpressions,
      // Guild Invites
      GatewayIntentBits.GuildInvites,
      // Guild Members
      GatewayIntentBits.GuildMembers,
      // Guild Messages
      GatewayIntentBits.GuildMessages,
      // Guild Moderation
      GatewayIntentBits.GuildModeration,
      // Guild Voice States
      GatewayIntentBits.GuildVoiceStates,
      // Guild Webhooks
      GatewayIntentBits.GuildWebhooks,
      // Guilds
      GatewayIntentBits.Guilds,
    ],
  }) as BotClient;

  // Initialize DisTube player
  const player = new DisTube(client, {
    plugins: [
      new DeezerPlugin(),
      new YouTubePlugin(),
      new SpotifyPlugin(),
      new SoundCloudPlugin(),
      new YtDlpPlugin({ update: false }),
    ] as any,
    customFilters: Array.isArray(config.filters)
      ? Object.fromEntries(config.filters.map((filter, i) => [filter, filter])) as any
      : (config.filters || {}) as any,
  });

  // Set the maximum number of listeners for the player to avoid memory leaks
  player.setMaxListeners(2);

  // Attach properties to client
  (client as any).mode = process.env.npm_lifecycle_event || 'start';
  client.configs = config;
  client.logger = logger;
  client.i18n = { t };
  client.temp = {
    startup: {
      start: Date.now(),
      end: 0,
    },
    commands: new Collection(),
    contexts: new Collection(),
  };
  client.player = player;
  
  // Initialize memory system for AI conversations
  client.userConversations = loadMemory();
  client.saveMemory = saveMemory;
  
  // Attach utility functions for message formatting
  client.formatBotReply = formatBotReply;
  client.splitMessageWithCodeBlocks = splitMessageWithCodeBlocks;
  
  // Attach stub functions for removed database integration
  // These functions were used for Firebase-based guild data and notifications
  // but the database integration has been removed from the project
  client.initializeData = async (guild: any) => {
    // Stub: Database integration removed
    // This function previously initialized guild data in Firebase
    client.logger.debug(`initializeData called for guild ${guild?.id} (database integration removed)`);
  };
  
  client.submitNotification = async (guild: any, eventName: string, embed: any) => {
    // Stub: Database integration removed
    // This function previously sent notifications to configured channels
    client.logger.debug(`submitNotification called for event ${eventName} in guild ${guild?.id} (database integration removed)`);
  };

  return client;
}

/**
 * Load all handlers
 */
export async function loadAllHandlers(client: BotClient): Promise<void> {
  // Load i18n locales
  client.logger.info('Loading language modules...');

  try {
    client.i18n = await initI18n();
  } catch (error) {
    client.logger.error(error, 'Error initializing i18next');
  }

  // Load commands
  await loadCommands(client);

  // Load contexts
  loadContexts(client);

  // Load events
  loadEvents(client);

  // Setup player events
  setupPlayerEvents(client);

  client.logger.info('All handlers loaded successfully');
}

/**
 * Register commands with Discord API
 */
export async function setupCommands(client: BotClient): Promise<void> {
  await registerCommands(client);
}

/**
 * Login bot
 */
export async function startBot(client: BotClient): Promise<void> {
  const config = client.configs;

  // Check configuration variables
  client.logger.info('Checking configuration variables...');

  if (!config.token) {
    client.logger.error('CONF: TOKEN is required in environment variables.');
    process.exit(1);
  }


  if (!config.gemini.apiKey) {
    client.logger.warn('CONF: Gemini API_KEY is not configured.');
  }


  // Load all handlers
  await loadAllHandlers(client);

  // Register commands
  await setupCommands(client);

  // Start logging in and working
  client.logger.info('Connecting to backend and logging in...');

  try {
    await client.login(config.token);
  } catch (error) {
    client.logger.fatal(error, 'Failed to login to Discord');
    process.exit(1);
  }
}
