declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGODB_URI: string;
      JWT_SECRET: string;
      RABBITMQ_URI: string;
      RATE_LIMIT_WINDOW: string;
      RATE_LIMIT_MAX_REQ: string;
    }
  }

  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
