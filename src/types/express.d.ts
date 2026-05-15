import 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    username?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    processedImage?: {
      path: string;
      alt?: string;
    };
  }
}

export {};
