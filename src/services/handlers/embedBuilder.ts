/**
 * Embed Builder Service - Kazemi x Shioru Fusion
 * Provides consistent, color-coded embed responses for different types of interactions
 */

import { EmbedBuilder, type EmbedAuthorOptions, type EmbedFooterOptions, type EmbedField } from 'discord.js';

/**
 * Embed color codes for different message types
 */
export enum EmbedColor {
  // Basic colors
  SUCCESS = 0x57F287,      // Green - Successful operations
  INFO = 0x5865F2,         // Blue - Information messages
  WARNING = 0xFEE75C,      // Yellow - Warning messages
  ERROR = 0xED4245,        // Red - Error messages
  
  // Category-specific colors
  MUSIC = 0x5865F2,        // Blue - Music commands
  FUN = 0xEB459E,          // Pink - Fun commands
  UTILITY = 0x57F287,      // Green - Utility commands
  MANAGER = 0xED4245,      // Red - Manager commands
  INFORMATION = 0x5865F2,  // Blue - Information commands
  DEVELOPER = 0x5865F2,    // Blue - Developer commands
  ME = 0x5865F2,           // Blue - Bot info commands
  MESSAGES = 0x5865F2,     // Blue - Message commands
  SETTINGS = 0x5865F2,      // Blue - Settings commands
  
  // AI-specific colors
  AI_DEFAULT = 0xFFB6C1,   // Light Pink - AI responses (Kazemi Miharu theme)
  AI_THINKING = 0x9370DB,  // Purple - AI processing
  AI_ERROR = 0xED4245,     // Red - AI errors
  
  // Premium colors
  PREMIUM_PINK = 0xE91E63, // Premium Pink - Special features
}

/**
 * Options for creating embeds
 */
export interface EmbedOptions {
  title?: string;
  description?: string;
  color?: number;
  fields?: EmbedField[];
  author?: EmbedAuthorOptions;
  footer?: EmbedFooterOptions;
  thumbnail?: string;
  image?: string;
  timestamp?: boolean;
  url?: string;
}

/**
 * Embed Builder Service Class
 * Provides static methods for creating different types of embeds
 */
export class EmbedBuilderService {
  /**
   * Create a success embed (green)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static success(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.SUCCESS,
    });
  }

  /**
   * Create an error embed (red)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static error(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.ERROR,
    });
  }

  /**
   * Create an info embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static info(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.INFO,
    });
  }

  /**
   * Create a warning embed (yellow)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static warning(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.WARNING,
    });
  }

  /**
   * Create a music embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static music(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MUSIC,
    });
  }

  /**
   * Create a fun embed (pink)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static fun(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.FUN,
    });
  }

  /**
   * Create a utility embed (green)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static utility(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.UTILITY,
    });
  }

  /**
   * Create a manager embed (red)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static manager(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MANAGER,
    });
  }

  /**
   * Create an information embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static information(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.INFORMATION,
    });
  }

  /**
   * Create a developer embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static developer(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.DEVELOPER,
    });
  }

  /**
   * Create a bot info embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static me(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.ME,
    });
  }

  /**
   * Create a messages embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static messages(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.MESSAGES,
    });
  }

  /**
   * Create a settings embed (blue)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static settings(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.SETTINGS,
    });
  }

  /**
   * Create an AI response embed (pink - Kuniko theme)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static aiResponse(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_DEFAULT,
      author: options.author || {
        name: '🌸 Kazemi Miharu',
        iconURL: 'https://i.imgur.com/xxx.png',
      },
    });
  }

  /**
   * Create an AI thinking embed (purple)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static aiThinking(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_THINKING,
      description: options.description || '🤔 กำลังคิด...',
    });
  }

  /**
   * Create an AI error embed (red)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static aiError(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.AI_ERROR,
      title: options.title || '❌ เกิดข้อผิดพลาด',
    });
  }

  /**
   * Create a premium embed (pink)
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static premium(options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color: EmbedColor.PREMIUM_PINK,
    });
  }

  /**
   * Create a custom embed with specified color
   * @param color - Custom color
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static custom(color: number, options: EmbedOptions): EmbedBuilder {
    return this.create({
      ...options,
      color,
    });
  }

  /**
   * Create an embed from options
   * @param options - Embed options
   * @returns EmbedBuilder instance
   */
  static create(options: EmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder();

    // Set color
    if (options.color) {
      embed.setColor(options.color);
    }

    // Set title
    if (options.title) {
      embed.setTitle(options.title);
    }

    // Set description
    if (options.description) {
      embed.setDescription(options.description);
    }

    // Set fields
    if (options.fields && options.fields.length > 0) {
      embed.addFields(options.fields);
    }

    // Set author
    if (options.author) {
      embed.setAuthor(options.author);
    }

    // Set footer
    if (options.footer) {
      embed.setFooter(options.footer);
    }

    // Set thumbnail
    if (options.thumbnail) {
      embed.setThumbnail(options.thumbnail);
    }

    // Set image
    if (options.image) {
      embed.setImage(options.image);
    }

    // Set timestamp
    if (options.timestamp) {
      embed.setTimestamp();
    }

    // Set URL
    if (options.url) {
      embed.setURL(options.url);
    }

    return embed;
  }

  /**
   * Create a simple embed with just title and description
   * @param title - Embed title
   * @param description - Embed description
   * @param color - Embed color (default: INFO)
   * @returns EmbedBuilder instance
   */
  static simple(title: string, description: string, color: number = EmbedColor.INFO): EmbedBuilder {
    return this.create({
      title,
      description,
      color,
    });
  }

  /**
   * Create an embed with fields
   * @param title - Embed title
   * @param fields - Array of fields
   * @param color - Embed color (default: INFO)
   * @returns EmbedBuilder instance
   */
  static withFields(title: string, fields: EmbedField[], color: number = EmbedColor.INFO): EmbedBuilder {
    return this.create({
      title,
      fields,
      color,
    });
  }

  /**
   * Create an embed with author
   * @param title - Embed title
   * @param description - Embed description
   * @param author - Author options
   * @param color - Embed color (default: INFO)
   * @returns EmbedBuilder instance
   */
  static withAuthor(
    title: string,
    description: string,
    author: EmbedAuthorOptions,
    color: number = EmbedColor.INFO,
  ): EmbedBuilder {
    return this.create({
      title,
      description,
      author,
      color,
    });
  }

  /**
   * Create an embed with thumbnail
   * @param title - Embed title
   * @param description - Embed description
   * @param thumbnail - Thumbnail URL
   * @param color - Embed color (default: INFO)
   * @returns EmbedBuilder instance
   */
  static withThumbnail(
    title: string,
    description: string,
    thumbnail: string,
    color: number = EmbedColor.INFO,
  ): EmbedBuilder {
    return this.create({
      title,
      description,
      thumbnail,
      color,
    });
  }

  /**
   * Create an embed with footer
   * @param title - Embed title
   * @param description - Embed description
   * @param footer - Footer options
   * @param color - Embed color (default: INFO)
   * @returns EmbedBuilder instance
   */
  static withFooter(
    title: string,
    description: string,
    footer: EmbedFooterOptions,
    color: number = EmbedColor.INFO,
  ): EmbedBuilder {
    return this.create({
      title,
      description,
      footer,
      color,
    });
  }

  /**
   * Create a complete embed with all options
   * @param options - All embed options
   * @returns EmbedBuilder instance
   */
  static complete(options: EmbedOptions): EmbedBuilder {
    return this.create(options);
  }
}

