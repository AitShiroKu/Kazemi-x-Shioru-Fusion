# Kazemi x Shioru Fusion - Architecture Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Handler System](#handler-system)
4. [Command System](#command-system)
5. [Event System](#event-system)
6. [Context System](#context-system)
7. [Music Player](#music-player)
8. [Embed System](#embed-system)
9. [i18n System](#i18n-system)
10. [AI Integration](#ai-integration)
11. [Best Practices](#best-practices)
12. [Migration Guide](#migration-guide)

---

## 📖 Overview

The Kazemi x Shioru Fusion project integrates two powerful Discord bot projects:

- **Kazemi**: AI-focused bot with Google Gemini AI integration and memory system
- **Shioru**: Feature-rich bot with comprehensive command/event/music systems

This document provides a comprehensive guide for understanding the fusion architecture and how to properly merge both systems.

---

## 🏗️ Project Structure

```
Kazemi/
├── src/
│   ├── client/           # Main client setup and initialization
│   ├── handlers/         # All handler loaders
│   │   ├── command.ts      # Command loader
│   │   ├── event.ts       # Event loader
│   │   ├── context.ts     # Context loader
│   │   ├── player.ts      # Player event handler
│   │   └── process.ts     # Process handlers
│   ├── services/         # Core services
│   │   ├── ai/           # AI services (Gemini, Memory)
│   │   ├── config/        # Configuration
│   │   ├── embed/         # Embed builder service
│   │   ├── i18n/          # Internationalization
│   │   ├── logger/        # Logger service
│   │   └── database/      # Database service (Firebase)
│   ├── commands/           # Command categories
│   │   ├── fun/         # Fun commands
│   │   ├── information/   # Information commands
│   │   ├── manager/     # Server management
│   │   ├── me/          # Bot info commands
│   │   ├── messages/     # Message commands
│   │   ├── music/       # Music commands
│   │   ├── settings/    # Settings commands
│   │   └── utility/      # Utility commands
│   ├── contexts/          # Context menu commands
│   ├── events/           # Discord events
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── discord.d.ts     # Discord type definitions
│   ├── index.ts            # Main entry point
│   └── data/             # Data files (memory.json, config.json)
├── locales/             # i18n translation files
└── docs/              # Documentation
└── .env.example          # Environment variables template
```

---

## 🎛 Handler System

The handler system follows a modular architecture where each handler is responsible for loading its specific type of content.

### Command Handler (`src/handlers/command.ts`)

Loads all slash commands from `src/commands/` directories:

```typescript
// Usage
import { loadCommands, registerCommands } from './handlers/command.js';

// In main.ts:
await loadCommands(client);
await registerCommands(client);
```

**Features:**
- Loads commands from category folders (fun, information, manager, me, messages, music, settings, utility)
- Validates command structure (data, execute, permissions, cooldown)
- Stores command metadata in `client.temp.commands` for help system
- Registers commands with Discord REST API

**Command Structure:**

```typescript
import { SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('command-name')
    .setDescription('Command description'),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('Command response');
  },
  cooldown: 3,
  category: 'utility',
  permissions: ['SendMessages'],
};
```

### Event Handler (`src/handlers/event.ts`)

Loads all Discord events from `src/events/` directory:

```typescript
// Usage
import { loadEvents } from './handlers/event.js';

// In main.ts:
loadEvents(client);
```

**Event Structure:**

```typescript
export const event = {
  name: 'ready',
  once: true,
  async execute(...args: any[]): Promise<void> {
    console.log('Bot is ready!');
  },
};
```

### Context Handler (`src/handlers/context.ts`)

Loads all context menu commands from `src/contexts/` directory:

```typescript
// Usage
import { loadContexts } from './handlers/context.js';

// In main.ts:
loadContexts(client);
```

**Context Structure:**

```typescript
import { ContextMenuCommandBuilder } from 'discord.js';

export const context = {
  data: new ContextMenuCommandBuilder()
    .setType(3) // User
    .setName('context-name'),
  async execute(interaction: ContextMenuCommandInteraction): Promise<void> {
    await interaction.reply('Context response');
  },
  cooldown: 3,
  permissions: ['SendMessages'],
};
```

### Player Handler (`src/handlers/player.ts`)

Handles all DisTube player events:

```typescript
import { setupPlayerEvents } from './handlers/player.js';

// In main.ts:
setupPlayerEvents(client);
```

**Player Events:**
- `ADD_LIST` - Playlist added to queue
- `ADD_SONG` - Song added to queue
- `FINISH` - Queue finished
- `ERROR` - Player error
- `PLAY_SONG` - Now playing
- `FINISH_SONG` - Song finished
- `DELETE_QUEUE` - Queue deleted
- `DISCONNECT` - Voice channel disconnected
- `EMPTY` - Voice channel empty

---

## 📨 Embed System

The embed system provides consistent, color-coded responses for different types of interactions.

**Embed Builder Service** (`src/services/embed/embedBuilder.ts`)

```typescript
import { EmbedBuilder, EmbedField } from 'discord.js';

export enum EmbedColor {
  SUCCESS = 0x57F287,      // Green
  INFO = 0x5865F2,         // Blue
  WARNING = 0xFEE75C,      // Yellow
  ERROR = 0xED4245,         // Red
  MUSIC = 0x5865F2,         // Blue
  FUN = 0xEB459E,           // Pink
  UTILITY = 0x57F287,      // Green
  MANAGER = 0xED4245,       // Red
  INFORMATION = 0x5865F2,   // Blue
  DEVELOPER = 0x5865F2,     // Blue
  ME = 0x5865F2,        // Blue
  MESSAGES = 0x5865F2,   // Blue
  SETTINGS = 0x5865F2,   // Blue
  AI_DEFAULT = 0xFFB6C1,    // Light Pink (Kuniko theme)
  AI_THINKING = 0x9370DB,   // Purple
  AI_ERROR = 0xED4245,      // Red
}

export class EmbedBuilderService {
  static success(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.SUCCESS,
    });
  }

  static error(options: EmbedBuilder): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.ERROR,
    });
  }

  static info(options: EmbedBuilder): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.INFO,
    });
  }

  static warning(options: EmbedBuilder): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.WARNING,
    });
  }

  static aiResponse(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_DEFAULT,
      author: options.author || {
        name: '🌸 Kuniko Zakura',
        iconURL: 'https://i.imgur.com/xxx.png',
      },
    });
  }

  static aiThinking(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_THINKING,
      description: options.description || '🤔 กำลังคิด...',
    });
  }

  static aiError(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_ERROR,
      title: options.title || '❌ เกิดข้อผิดพลาด',
    });
  }

  static music(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MUSIC,
    });
  }

  static fun(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.FUN,
    });
  }

  static utility(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.UTILITY,
    });
  }

  static manager(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MANAGER,
    });
  }

  static information(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.INFORMATION,
    });
  }

  static developer(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.DEVELOPER,
    });
  }

  static me(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.ME,
    });
  }

  static messages(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MESSAGES,
    });
  }

  static settings(options: EmbedOptions): EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.SETTINGS,
    });
  }

  static create(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.color) embed.setColor(options.color as any);
    if (options.fields) embed.addFields(options.fields);
    if (options.author) embed.setAuthor(options.author);
    if (options.footer) embed.setFooter(options.footer);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.timestamp) embed.setTimestamp();

    return embed;
  }
}
```

**Usage Examples:**

```typescript
import { EmbedBuilderService } from './services/embed/embedBuilder.js';

// Success response
const successEmbed = EmbedBuilderService.success({
  title: '✅ Success',
  description: 'Operation completed successfully',
});

// Error response
const errorEmbed = EmbedBuilderService.error({
  title: '❌ Error',
  description: 'An error occurred',
});

// AI response
const aiEmbed = EmbedBuilderService.aiResponse({
  title: '🌸 Kuniko Zakura',
  description: 'AI response here...',
});

// Music response
const musicEmbed = EmbedBuilderService.music({
  title: '🎵 Now Playing',
  description: 'Song info...',
});
```

---

## 🌐 i18n System

Internationalization is handled by i18next with file system backend.

**i18n Service** (`src/services/i18n/i18n.ts`)

```typescript
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';

export async function initI18n() {
  const localePath = join(process.cwd(), 'src', 'services', 'i18n', 'locales');
  
  const availableLocales = readdirSync(localePath).filter((fileName) => {
    const joinedPath = join(localePath, fileName);
    return lstatSync(joinedPath).isDirectory();
  });

  await i18next.use(Backend).init({
    debug: false,
    initImmediate: false,
    fallbackLng: 'th',
    lng: 'en-US',
    preload: availableLocales,
    backend: {
      loadPath: join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),
    },
  });

  return i18next;
}

export function t(key: string, options?: any): string {
  return i18next.t(key, options);
}

export function getLanguage(): string {
  return i18next.language;
}

export function changeLanguage(lng: string): Promise<void> {
  await i18next.changeLanguage(lng);
}
```

**Usage:**

```typescript
import { t } from './services/i18n/i18n.js';

// Get translated text
const translatedText = t('handlers.player.addList.added_list', {
  playlist_name: '{{playlist_name}}',
  amount: '{{amount}}',
});

// Change language
await changeLanguage('th');
```

---

## 🤖 AI Integration

The AI system uses Google Gemini AI with memory system.

**AI Service** (`src/services/ai/gemini.ts`)

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadMemory, saveMemory, type MemoryData } from './memory.js';

export async function geminiResponse(
  prompt: string,
  userId: string,
  username: string,
  memory: MemoryData,
  saveMemory: (memory: MemoryData) => void,
): Promise<string> {
  // AI logic here...
}
```

**Memory System** (`src/utils/memory.ts`)

```typescript
import { readFileSync, writeFileSync } from 'fs';
import type { MemoryData } from './types/index.js';

const MEMORY_FILE = './data/memory.json';

export function loadMemory(): MemoryData {
  try {
    const data = JSON.parse(readFileSync(MEMORY_FILE, 'utf-8'));
    return data || {};
  } catch (error) {
    console.error('Failed to load memory:', error);
    return {};
  }
}

export function saveMemory(data: MemoryData): void {
  try {
    writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save memory:', error);
  }
}
```

---

## 🎯 Best Practices

### TypeScript Types

**Use strict type checking** - Enable all strict options in `tsconfig.json`

**Define interfaces for all data structures** - Create clear interfaces for:
- Command metadata
- Event handlers
- Context commands
- Player events
- Bot client extensions

**Use consistent naming conventions:**
- File names: kebab-case for files
- Interface names: PascalCase for interfaces

### Directory Organization

```
src/
├── commands/           # Grouped by category
├── contexts/          # Context commands
├── events/           # Event handlers
├── handlers/         # Handler loaders
├── services/         # Reusable services
├── types/           # Type definitions
└── utils/           # Utility functions
```

### Code Style

**Use ES modules** - All imports use ES module syntax
**Use async/await** - All async operations use async/await

**Error handling** - Use try-catch blocks
**Logging** - Use structured logging with pino

---

## 📝 Migration Guide

### Step 1: Copy Shioru Commands to TypeScript

For each command in `Shioru/source/commands/`:

1. Copy the JavaScript file to `Kazemi/src/commands/<category>/`
2. Convert to TypeScript syntax:
   - Change `module.exports` to `export default`
   - Change `require()` to `import`
   - Convert `const` to `export const`
   - Add type annotations

3. Update imports:
   ```javascript
   // Old
   const { Collection, PermissionsBitField } = require("discord.js");
   
   // New
   import { Collection, PermissionsBitField } from 'discord.js';
   ```

4. Convert command structure:
   ```javascript
   // Old
   module.exports = {
     data: new SlashCommandBuilder()
       .setName('name')
       .setDescription('description'),
     execute: async (interaction) => {
       await interaction.reply('Response');
     },
     cooldown: 3,
     permissions: new PermissionsBitField('SendMessages').toArray(),
   };
   
   // New
   export const command = {
     data: new SlashCommandBuilder()
       .setName('name')
       .setDescription('description'),
     execute: async (interaction: ChatInputCommandInteraction) => {
       await interaction.reply('Response');
       },
     cooldown: 3,
       permissions: ['SendMessages'],
   };
   ```

### Step 2: Copy Shioru Events to TypeScript

For each event in `Shioru/source/events/`:

1. Copy to `Kazemi/src/events/`
2. Convert to TypeScript syntax:
   - Change `module.exports` to `export default`
   - Change `require()` to `import`
   - Add type annotations

3. Update imports:
   ```javascript
   // Old
   module.exports = {
     name: 'ready',
     once: true,
     execute: async (...args) => {
       console.log('Bot is ready!');
     },
   };
   
   // New
   export const event = {
     name: 'ready',
     once: true,
     execute: async (...args: any[]) => {
       console.log('Bot is ready!');
     },
   };
   ```

### Step 3: Integrate Shioru Locales

1. Copy `Shioru/source/locales/` to `Kazemi/locales/`
2. Copy all JSON files
3. Ensure consistent structure

### Step 4: Update Main Entry Point

Update `src/index.ts` to use new client setup:

```typescript
import { createClient, initializeFirebase, loadAllHandlers, setupCommands, startBot as startBotClient } from './client/client.js';

async function startBot(): Promise<void> {
  const client = createClient();
  await initializeFirebase(client.configs);
  await loadAllHandlers(client);
  await setupCommands(client);
  await startBot(client);
}
```

---

## 🎨 Color Coding Guide

### Embed Colors by Category

| Category | Color | Hex Code | Usage |
|-----------|---------|-----------|----------|
| Success | 0x57F287 | `EmbedColor.SUCCESS` | Success responses |
| Info | 0x5865F2 | `EmbedColor.INFO` | Information messages |
| Warning | 0xFEE75C | `EmbedColor.WARNING` | Warnings |
| Error | 0xED4245 | `EmbedColor.ERROR` | Errors |
|-----------|-----------|----------|----------|
| Music | 0x5865F2 | `EmbedColor.MUSIC` | Music commands |
| Fun | 0xEB459E | `EmbedColor.FUN` | Fun commands |
| Utility | 0x57F287 | `EmbedColor.UTILITY` | Utility commands |
| Manager | 0xED4245 | `EmbedColor.MANAGER` | Manager commands |
| Information | 0x5865F2 | `EmbedColor.INFORMATION` | Information commands |
| Developer | 0x5865F2 | `EmbedColor.DEVELOPER` | Developer commands |
| Me | 0x5865F2 | `EmbedColor.ME` | Bot info commands |
| Messages | 0x5865F2 | `EmbedColor.MESSAGES` | Message commands |
| Settings | 0x5865F2 | `EmbedColor.SETTINGS` | Settings commands |
|-----------|----------|----------|
| AI | 0xFFB6C1 | `EmbedColor.AI_DEFAULT` | AI responses (Kuniko theme) |
| AI Thinking | 0x9370DB | `EmbedColor.AI_THINKING` | AI processing |
| AI Error | 0xED4245 | `EmbedColor.AI_ERROR` | AI errors |

---

## 🔧 Command Categories

| Category | Description | Example Commands |
|-----------|---------|----------|
| **Developer** | Bot owner commands and utilities |
| **Fun** | Entertainment and games |
| **Information** | Server and user information |
| **Manager** | Server moderation and management |
| **Me** | Bot information and stats |
| **Messages** | Message management |
| **Music** | Music playback and controls |
| **Settings** | Bot configuration |
| **Utility** | Helper commands and tools |
|-----------|----------|----------|
| `developer` | `!eval`, `!reload` | Developer tools |
| `fun` | `!meme`, `!joke` | Fun commands |
| `information` | `!avatar`, `!server` | Server info |
| `manager` | `!kick`, `!ban` | Moderation |
| `me` | `!stats`, `!info` | Bot stats |
| `messages` | `!purge` | Message cleanup |
| `music` | `!play`, `!skip` | Music commands |
| `settings` | `!language` | Settings |
| `utility` | `!help`, `!ping` | Utility commands |

---

## 📚 Example Command

Here's an example of a converted Shioru command:

```typescript
import { SlashCommandBuilder } from 'discord.js';
import { EmbedBuilderService } from '../../services/embed/embedBuilder.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('example')
    .setDescription('An example command from Shioru')
    .setDescription('This demonstrates the fusion command structure'),
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const embed = EmbedBuilderService.information({
      title: '📋 Example Command',
      description: 'This shows how to structure commands properly',
      fields: [
        {
          name: 'Category',
          value: 'utility',
          inline: true,
        },
        {
          name: 'Permissions',
          value: 'SendMessages',
          inline: true,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
  permissions: ['SendMessages'],
  cooldown: 3,
  category: 'utility',
};
```

---

## 🎮 Example Event

```typescript
import type { Event } from '../../types/index.js';

export const event: Event = {
  name: 'messageCreate',
  once: false,
  execute: async (...args: any[]): Promise<void> {
    const { channel } = args[0];
    
    client.logger.info(`Message created in #${channel.name}`);
    
    const embed = EmbedBuilderService.success({
      title: '✅ Message Created',
      description: `A message was sent in ${channel.name}`,
    });

    if (channel.isSendable()) {
      await channel.send({ embeds: [embed] });
    }
  },
};
```

---

## 🤖 Example Context Command

```typescript
import { ContextMenuCommandBuilder } from 'discord.js';
import { EmbedBuilderService } from '../../services/embed/embedBuilder.js';

export const context = {
  data: new ContextMenuCommandBuilder()
    .setType(3) // User
    .setName('Show Avatar'),
  async execute(interaction: ContextMenuCommandInteraction): Promise<void> {
    const { target, target } = interaction;

    const embed = EmbedBuilderService.information({
      title: '👤 User Info',
      fields: [
        {
          name: 'Username',
          value: target.user.username,
          inline: true,
        },
        {
          name: ' 'User ID',
          value: target.user.id,
          inline: true,
        },
      ],
    });

    await interaction.reply({ embeds: [embed] });
  },
  cooldown: 3,
  permissions: ['SendMessages'],
};
```

---

## 🎵 Example Music Command

```typescript
import { EmbedBuilderService } from '../../services/embed/embedBuilder.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from URL'),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const { channel } = interaction;
    const embed = EmbedBuilderService.music({
      title: '🎵 Playing',
      description: 'Now playing...',
    });

    if (channel.isSendable()) {
      await channel.send({ embeds: [embed] });
    }
  },
  permissions: ['SendMessages', 'Connect'],
  category: 'music',
};
```

---

## 📝 Integration Checklist

Use this checklist to verify the fusion is complete:

- [x] Commands from Shioru converted to TypeScript
- [ ] Events from Shioru converted to TypeScript
- [ ] Contexts from Shioru converted to TypeScript
- [ ] Player events integrated from Shioru
- [ ] i18n system configured with Shioru locales
- [ ] Firebase integration from Kazemi preserved
- [ ] Embed system enhanced with color coding
- [ ] AI features from Kazemi preserved
- [ ] Music player with DisTube configured
- [ ] All handlers loaded and working
- [ ] Commands registered with Discord API
- [ ] Process handlers for unhandled exceptions
- [ ] Bot client properly initialized with all extensions
- [ ] TypeScript types defined for complete fusion

---

## 🎓 Resources

- [Discord.js Documentation](https://discord.js.org/)
- [DisTube Documentation](https://distube.dev/)
- [i18next Documentation](https://www.i18next.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Gemini AI Documentation](https://ai.google.dev/docs/generative-ai)

---

## 🚀 Quick Start

1. Copy locale files from Shioru to `Kazemi/locales/`
2. Ensure all categories have at least one command
3. Run `npm run build` to compile TypeScript
4. Configure environment variables in `.env`
5. Run `npm run dev` to start bot in development mode

---

## 📞 Support

For issues or questions:
- Review this documentation
- Check Shioru source code for additional patterns
- Refer to Discord.js and DisTube documentation
- Check Kazemi AI service for proper integration
- Review embed system for color coding consistency
