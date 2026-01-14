import type { JWTPayload } from "./index.ts";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      RABBITMQ_URI: string;
      JWT_SECRET: string;
      RATE_LIMIT_WINDOW: string;
      RATE_LIMIT_MAX_REQ: string;
    }
  }

  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export {};
