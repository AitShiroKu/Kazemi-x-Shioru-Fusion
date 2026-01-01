/**
 * Embed Response System with Color Coding
 * Kazemi x Shioru Fusion
 */

import { EmbedBuilder, ColorResolvable, EmbedField } from 'discord.js';
import type { EmbedOptions } from '../../types/index.js';

/**
 * Embed Color Enum with predefined colors for different response types
 */
export enum EmbedColor {
  // Success Colors
  SUCCESS = 0x57F287,      // Green
  INFO = 0x5865F2,         // Blue
  // Warning Colors
  WARNING = 0xFEE75C,      // Yellow
  // Error Colors
  ERROR = 0xED4245,         // Red
  // Category Colors
  MUSIC = 0x5865F2,         // Blue
  FUN = 0xEB459E,           // Pink
  UTILITY = 0x57F287,      // Green
  MANAGER = 0xED4245,       // Red
  INFORMATION = 0x5865F2,   // Blue
  DEVELOPER = 0x5865F2,     // Blue
  ME = 0x5865F2,            // Blue
  MESSAGES = 0x5865F2,       // Blue
  SETTINGS = 0x5865F2,      // Blue
  // AI Colors (from Kazemi - Kuniko theme)
  AI_DEFAULT = 0xFFB6C1,    // Light Pink
  AI_THINKING = 0x9370DB,   // Purple
  AI_ERROR = 0xED4245,      // Red
}

/**
 * Embed Builder Service
 * Provides methods to create consistent embeds with color coding
 */
export class EmbedBuilderService {
  /**
   * Create a success embed (Green)
   */
  static success(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.SUCCESS,
    });
  }

  /**
   * Create an error embed (Red)
   */
  static error(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.ERROR,
    });
  }

  /**
   * Create an info embed (Blue)
   */
  static info(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.INFO,
    });
  }

  /**
   * Create a warning embed (Yellow)
   */
  static warning(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.WARNING,
    });
  }

  /**
   * Create an AI response embed (Pink - Kuniko theme)
   */
  static aiResponse(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_DEFAULT,
      author: options.author || {
        name: '🌸 Kuniko Zakura',
        iconURL: 'https://i.imgur.com/xxx.png', // Replace with actual bot avatar
      },
    });
  }

  /**
   * Create an AI thinking embed (Purple)
   */
  static aiThinking(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_THINKING,
      description: options.description || '🤔 กำลังคิด...',
    });
  }

  /**
   * Create an AI error embed (Red)
   */
  static aiError(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_ERROR,
      title: options.title || '❌ เกิดข้อผิดพลาด',
    });
  }

  /**
   * Create a music embed (Blue)
   */
  static music(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MUSIC,
    });
  }

  /**
   * Create a fun embed (Pink)
   */
  static fun(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.FUN,
    });
  }

  /**
   * Create a utility embed (Green)
   */
  static utility(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.UTILITY,
    });
  }

  /**
   * Create a manager embed (Red)
   */
  static manager(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MANAGER,
    });
  }

  /**
   * Create an information embed (Blue)
   */
  static information(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.INFORMATION,
    });
  }

  /**
   * Create a developer embed (Blue)
   */
  static developer(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.DEVELOPER,
    });
  }

  /**
   * Create a settings embed (Blue)
   */
  static settings(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.SETTINGS,
    });
  }

  /**
   * Create a messages embed (Blue)
   */
  static messages(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MESSAGES,
    });
  }

  /**
   * Create a custom embed with any color
   */
  static create(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder();

    if (options.title) embed.setTitle(options.title);
    if (options.description) embed.setDescription(options.description);
    if (options.color) embed.setColor(options.color as ColorResolvable);
    if (options.fields) embed.addFields(options.fields as EmbedField[]);
    if (options.author) embed.setAuthor(options.author);
    if (options.footer) embed.setFooter(options.footer);
    if (options.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options.image) embed.setImage(options.image);
    if (options.timestamp) embed.setTimestamp();

    return embed;
  }
}

/**
 * Helper function to create action rows with buttons
 */
export function createActionRow(buttons: any[]): any {
  return {
    components: [
      {
        type: 1, // Action Row
        components: buttons,
      },
    ],
  };
}

/**
 * Helper function to create a button
 */
export function createButton(options: {
  label: string;
  style: number;
  customId?: string;
  url?: string;
  emoji?: string;
}): any {
  return {
    type: 2, // Button
    label: options.label,
    style: options.style,
    custom_id: options.customId,
    url: options.url,
    emoji: options.emoji,
  };
}
