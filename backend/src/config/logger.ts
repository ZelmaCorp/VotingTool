import pino from 'pino';
import { hostname } from 'os';
import { Subsystem, ErrorType } from '../types/logging';

// Read version from package.json with fallback
let APP_VERSION = "1.2.0-fallback";
try {
  const packageJson = require("../../package.json");
  APP_VERSION = packageJson.version;
} catch (error) {
  console.warn("Could not read package.json in logger, using fallback version");
}

// Detect if running under PM2 or in an environment that needs JSON logs
const isProduction = process.env.NODE_ENV === 'production';
const isPM2 = process.env.PM2_HOME !== undefined || process.env.pm_id !== undefined;
const isLogAggregation = process.env.LOKI_ENABLED === 'true' || process.env.LOG_FORMAT === 'json';

// Use pretty printing only in development and not under PM2 or log aggregation
const shouldUsePretty = !isProduction && !isPM2 && !isLogAggregation;

// Create the logger configuration
const loggerConfig = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  // Use pino-pretty only in local development
  transport: shouldUsePretty ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    }
  } : undefined,
  // Base fields to include in all logs
  base: {
    pid: process.pid,
    hostname: hostname(),
    service: 'VotingTool',
    version: APP_VERSION,
  },
  // Timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Create the base logger instance
const baseLogger = pino(loggerConfig);

// Create subsystem loggers
export const createSubsystemLogger = (subsystem: Subsystem) => {
  return baseLogger.child({ subsystem });
};

// Helper function for critical errors with types
export const logError = (
  subsystemLogger: pino.Logger, 
  context: Record<string, any>, 
  message: string, 
  errorType?: ErrorType
) => {
  const logContext = errorType ? { ...context, type: errorType } : context;
  subsystemLogger.error(logContext, message);
};

// Export the base logger and convenience logger
export const logger = baseLogger;
export default baseLogger; 