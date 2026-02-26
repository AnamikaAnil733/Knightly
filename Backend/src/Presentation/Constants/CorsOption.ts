import {  CorsOptions } from "cors";

export const corsOptions:CorsOptions = {
  origin: process.env.ORIGIN_URL,
  credentials: true,
};
