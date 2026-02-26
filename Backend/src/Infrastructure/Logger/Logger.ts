import pino from "pino";

export const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
        },
        level: "info",
      },
      {
        // Rotating file output
        target: "pino-roll",
        options: {
          file: "./logs/app.log",
          size: "10m",
          count: 5,
          mkdir: true,
        },
        level: "info",
      },
    ],
  },
});
