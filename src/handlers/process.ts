/**
 * Process Handler - Handles process events
 * Converted from Shioru's process.js to TypeScript
 */

import type { BotClient } from '../types/index.js';

export function setupProcessHandlers(client: BotClient): void {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    client.logger.error(
      `Unhandled Rejection at: ${promise}\nReason: ${reason}`,
    );
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    client.logger.fatal(error, 'Uncaught Exception');
  });

  // Handle warning
  process.on('warning', (warning) => {
    client.logger.warn(warning);
  });

  client.logger.info('Process handlers loaded successfully');
}
