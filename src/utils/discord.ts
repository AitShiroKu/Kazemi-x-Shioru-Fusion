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
import { initializeDatabase, getDatabaseRef } from '../services/database/firebase.js';
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
 * Utility to submit notifications based on guild settings
 */
const submitNotification = async (guild: any, eventName: string, embedData: EmbedBuilder) => {
  try {
    const guildRef = client.database.ref(`guilds/${guild.id}`);
    const snapshot = await guildRef.get();
    if (!snapshot.exists()) return;

    const guildData = snapshot.val();
    const notifyConfig = guildData.notify?.[eventName.toLowerCase()] || guildData.notify?.[eventName];

    if (notifyConfig?.enable) {
      // Use configured channel or default to system channel/first text channel
      const channelId = notifyConfig.channelId || guild.systemChannelId;
      const channel = guild.channels.cache.get(channelId);

      if (channel && channel.isTextBased()) {
        await channel.send({ embeds: [embedData] });
      }
    }
  } catch (err) {
    client.logger.error(err, `Failed to submit notification for ${eventName}`);
  }
};

/**
 * Utility to initialize or update guild data
 */
const initializeData = async (guild: any) => {
  try {
    const guildRef = client.database.ref(`guilds/${guild.id}`);
    const snapshot = await guildRef.get();

    if (!snapshot.exists()) {
      await guildRef.set({
        joinedAt: guild.joinedAt?.toISOString() || new Date().toISOString(),
        name: guild.name,
        memberCount: guild.memberCount,
        notify: {
          message: { enable: true },
          join: { enable: true },
          leave: { enable: true },
        }
      });
    }
  } catch (err) {
    client.logger.error(err, `Failed to initialize data for guild ${guild.id}`);
  }
};

// Map Kazemi utilities to client for event handlers
(client as any).geminiResponse = geminiResponse;
(client as any).splitMessageWithCodeBlocks = splitMessageWithCodeBlocks;
(client as any).formatBotReply = formatBotReply;
(client as any).userConversations = loadMemory();
(client as any).saveMemory = saveMemory;
(client as any).AttachmentBuilder = AttachmentBuilder;
(client as any).webhookSend = webhookSend;
(client as any).submitNotification = submitNotification;
(client as any).initializeData = initializeData;

export async function startBot() {
  try {
    // 1. Setup Process Handlers
    setupProcessHandlers(client);

    // 2. Initialize Database
    initializeDatabase(client.configs);
    const { get, set, child } = await import('firebase/database');
    client.database = {
      ref: (path: string) => ({
        get: () => get(child(getDatabaseRef(), path)),
        set: (data: any) => set(child(getDatabaseRef(), path), data),
        transaction: async (fn: any) => {
          const nodeRef = child(getDatabaseRef(), path);
          try {
            const snapshot = await get(nodeRef);
            const newValue = fn(snapshot.val());
            if (newValue !== undefined) await set(nodeRef, newValue);
          } catch (error) {
            client.logger.error(error, `Transaction failed for ${path}`);
          }
        }
      })
    };

    // 3. Initialize i18n
    client.i18n = await initI18n();

    // 4. Initialize Music Player
    client.player = initializeMusicPlayer(client, client.configs);
    setupPlayerEvents(client);

    // 5. Load Handlers
    loadEvents(client);
    await loadCommands(client);
    loadContexts(client);

    // 6. Register Slash Commands
    await registerCommands(client);

    // 7. Login
    await client.login(config.token);
  } catch (error) {
    client.logger.error(error, 'Failed to start bot');
    process.exit(1);
  }
}
