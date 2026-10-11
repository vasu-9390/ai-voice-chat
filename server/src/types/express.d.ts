import { TokenPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      organizationId?: string;
      id?: string; // Request ID
    }
  }
}

export {};
