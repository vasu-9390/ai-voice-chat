import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { UserRole } from '../constants/roles';

export interface TokenPayload {
  userId: string;
  organizationId: string;
  role: UserRole;
  email: string;
}

export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as any,
  });
};

export const signRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as any,
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
};
