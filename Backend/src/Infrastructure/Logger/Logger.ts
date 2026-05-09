import pino, { Logger } from "pino";
import path from "path";

class AppLogger {
  private logger: Logger;

  constructor() {
    const logLevel = process.env.LOG_LEVEL || "info";
    const isProduction = process.env.NODE_ENV === "production";

    const targets = [];

    // Always log to file with rotation
    targets.push({
      target: "pino-roll",
      level: logLevel,
      options: {
        file: path.resolve(__dirname, "../../../logs/app.log"),
        size: process.env.SIZE,
        count: Number(process.env.COUNT),
        mkdir: true,
      },
    });

    // Use pino-pretty for better readability in development/local
    if (!isProduction) {
      targets.push({
        target: "pino-pretty",
        level: logLevel,
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
      });
    }

    this.logger = pino({
      level: logLevel,
      transport: {
        targets,
      },
    });
  }

  info(data?: unknown, message?: string) {
    if (typeof data === "string" && message === undefined) {
      this.logger.info(data);
    } else {
      this.logger.info(data, message);
    }
  }

  error(data?: unknown, message?: string) {
    if (typeof data === "string" && message === undefined) {
      this.logger.error(data);
    } else {
      this.logger.error(data, message);
    }
  }

  warn(data?: unknown, message?: string) {
    if (typeof data === "string" && message === undefined) {
      this.logger.warn(data);
    } else {
      this.logger.warn(data, message);
    }
  }

  debug(data?: unknown, message?: string) {
    if (typeof data === "string" && message === undefined) {
      this.logger.debug(data);
    } else {
      this.logger.debug(data, message);
    }
  }
}

export const logger = new AppLogger();

