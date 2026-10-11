import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';
import { redisClient } from '../config/redis';
import { ApiKey } from '../models/ApiKey';
import crypto from 'crypto';
import { UserRole } from '../constants/roles';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Check API Key header
    const apiKeyHeader = req.headers['x-api-key'] as string;
    if (apiKeyHeader) {
      const [prefix] = apiKeyHeader.split('_');
      const hash = crypto.createHash('sha256').update(apiKeyHeader).digest('hex');
      const apiKeyDoc = await ApiKey.findOne({
        keyPrefix: prefix || apiKeyHeader.slice(0, 8),
        isActive: true,
      }).select('+keyHash');

      if (apiKeyDoc && apiKeyDoc.keyHash === hash) {
        if (apiKeyDoc.expiresAt && apiKeyDoc.expiresAt < new Date()) {
          throw new UnauthorizedError('API key has expired');
        }
        apiKeyDoc.lastUsedAt = new Date();
        apiKeyDoc.save().catch(() => {});

        req.user = {
          userId: apiKeyDoc._id.toString(),
          organizationId: apiKeyDoc.organizationId.toString(),
          role: UserRole.ORG_ADMIN,
          email: `apikey-${apiKeyDoc.name.toLowerCase()}@system.local`,
        };
        req.organizationId = apiKeyDoc.organizationId.toString();
        return next();
      }
    }

    // 2. Check JWT Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing or malformed');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication token is missing');
    }

    // Check token blacklist in Redis (logout / revocation)
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token has been revoked');
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    req.organizationId = decoded.organizationId;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid access token'));
    } else {
      next(error);
    }
  }
};
