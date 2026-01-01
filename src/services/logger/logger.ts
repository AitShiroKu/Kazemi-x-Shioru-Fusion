/**
 * Logger Service
 * Kazemi x Shioru Fusion
 */

import pino from 'pino';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname',
  },
});

const logger = pino(transport);

export default logger;

export function createLogger(name: string) {
  return logger.child({ name });
}
