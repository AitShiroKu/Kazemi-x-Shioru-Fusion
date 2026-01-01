/**
 * Main Client Setup - Kazemi x Shioru Fusion
 * Integrates all handlers, services, and configurations
 */

import {
  Client,
  GatewayIntentBits,
  Partials,
  PresenceUpdateStatus,
  ActivityType,
  Collection,
} from 'discord.js';
import { initializeApp } from 'firebase/app';
import { connectDatabaseEmulator, getDatabase } from 'firebase/database';
import { DisTube } from 'distube';
import { DeezerPlugin } from '@distube/deezer';
import { YouTubePlugin } from '@distube/youtube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { YtDlpPlugin } from '@distube/yt-dlp';

import type { BotClient, BotConfig } from '../types/index.js';
import { loadCommands, registerCommands } from '../handlers/command.js';
import { loadEvents } from '../handlers/event.js';
import { loadContexts } from '../handlers/context.js';
import { setupPlayerEvents } from '../handlers/player.js';
import { setupProcessHandlers } from '../handlers/process.js';
import config from '../services/config/config.js';
import logger from '../services/logger/logger.js';
import { initI18n, t } from '../services/i18n/i18n.js';

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
    presence: {
      status: PresenceUpdateStatus.Idle,
      afk: true,
      activities: [
        {
          name: '🌸 Kazemi Miharu',
          type: ActivityType.Custom,
        },
      ],
    },
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

  return client;
}

/**
 * Initialize Firebase
 */
export function initializeFirebase(client: BotClient, config: BotConfig): void {
  try {
    initializeApp({
      apiKey: config.firebase.apiKey,
      authDomain: config.firebase.authDomain,
      databaseURL: config.firebase.databaseURL,
      projectId: config.firebase.projectId,
      storageBucket: config.firebase.storageBucket,
      messagingSenderId: config.firebase.messagingSenderId,
      appId: config.firebase.appId,
      measurementId: config.firebase.measurementId,
    });

    client.database = getDatabase();

    if ((client as any).mode !== 'start') {
      connectDatabaseEmulator(
        client.database,
        config.emulators.database.host,
        config.emulators.database.port,
      );
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    process.exit(1);
  }
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

  // Setup process handlers
  setupProcessHandlers(client);

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

  if (!config.firebase.apiKey) {
    client.logger.warn('CONF: Firebase API_KEY is not configured.');
  }

  if (!config.gemini.apiKey) {
    client.logger.warn('CONF: Gemini API_KEY is not configured.');
  }

  // Initialize Firebase
  initializeFirebase(client, config);

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
