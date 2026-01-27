/**
 * Logger Service
 * Kazemi x Shioru Fusion
 */

import pino from "pino";
import path from "path";
import { DEBUG_MODE } from "../config/config.js";

// Configure transport based on DEBUG_MODE
const transport = DEBUG_MODE
  ? pino.transport({
      targets: [
        {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
          },
        },
        {
          target: "pino/file",
          options: {
            destination: path.join(process.cwd(), "logs", "debug.log"),
            mkdir: true,
          },
        },
      ],
    })
  : pino.transport({
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    });

const logger = pino(
  {
    level: DEBUG_MODE ? "debug" : "info",
  },
  transport
);

export default logger;

export function createLogger(name: string) {
  return logger.child({ name });
}

// Enhanced debug method with context support
export function debug(message: string, data?: any, context?: string) {
  if (DEBUG_MODE) {
    const logData = { context, data };
    logger.debug(logData, message);
  }
}

// Conditional debug helper for performance-critical sections
export function debugConditional(
  condition: boolean,
  message: string,
  data?: any,
  context?: string,
) {
  if (DEBUG_MODE && condition) {
    debug(message, data, context);
  }
}
