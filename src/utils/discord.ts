import {
  Client,
  GatewayIntentBits,
  PermissionsBitField,
  Collection,
  AttachmentBuilder,
  WebhookClient,
  EmbedBuilder,
} from 'discord.js';
import { loadMemory, saveMemory, type MemoryData } from './memory.js';
import { geminiResponse } from './gemini.js';
import { splitMessageWithCodeBlocks, formatBotReply } from './utils.js';
import { config } from '../services/config/config.js';
import { initI18n } from '../services/i18n/i18n.js';
import { initializeMusicPlayer } from '../services/music/distube.js';
import { loadEvents } from '../handlers/event.js';
import { loadCommands, registerCommands } from '../handlers/command.js';
import { loadContexts } from '../handlers/context.js';
import { setupProcessHandlers } from '../handlers/process.js';
import { setupPlayerEvents } from '../handlers/player.js';
import logger from '../services/logger/logger.js';
import type { BotClient } from '../types/index.js';

// Set up Discord Bot with required intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
}) as BotClient;

// Initialize BotClient properties
client.commands = new Collection();
client.contexts = new Collection();
client.cooldowns = new Collection();
client.logger = logger;
client.configs = config;
client.temp = {
  startup: {
    start: Date.now(),
    end: 0,
  },
  commands: new Collection(),
  contexts: new Collection(),
};

/**
 * Utility to send webhook messages
 */
const webhookSend = async (url: string, message: any) => {
  try {
    const webhook = new WebhookClient({ url });
    return await webhook.send(message);
  } catch (err) {
    client.logger.error(err, 'Failed to send webhook');
  }
};

/**
 * Empty functions to prevent crashes after database removal
 */
const initializeData = async () => { };
const submitNotification = async () => { };

// Map Kazemi utilities to client for event handlers
(client as any).geminiResponse = geminiResponse;
(client as any).splitMessageWithCodeBlocks = splitMessageWithCodeBlocks;
(client as any).formatBotReply = formatBotReply;
(client as any).userConversations = loadMemory();
(client as any).saveMemory = saveMemory;
(client as any).AttachmentBuilder = AttachmentBuilder;
(client as any).webhookSend = webhookSend;
(client as any).initializeData = initializeData;
(client as any).submitNotification = submitNotification;

export async function startBot() {
  try {
    // 1. Setup Process Handlers
    setupProcessHandlers(client);

    // 2. Initialize i18n
    client.i18n = await initI18n();

    // 3. Initialize Music Player
    client.player = initializeMusicPlayer(client, client.configs);
    setupPlayerEvents(client);

    // 4. Load Handlers
    loadEvents(client);
    await loadCommands(client);
    loadContexts(client);

    // 5. Register Slash Commands
    await registerCommands(client);

    // 6. Login
    await client.login(config.token);
  } catch (error) {
    client.logger.error(error, 'Failed to start bot');
    process.exit(1);
  }
}
