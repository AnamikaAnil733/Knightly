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
        // File output
        target: "pino/file",
        options: {
          destination: "./logs/app.log", 
          mkdir: true                     
        },
        level: "info",
      }
    ],
  },
});