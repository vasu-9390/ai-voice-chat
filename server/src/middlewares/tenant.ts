import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';
import { UserRole } from '../constants/roles';

export const requireTenant = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return next(new UnauthorizedError('Tenant context requires prior authentication'));
  }

  // Super Admins can optionally switch tenant context via header
  if (req.user.role === UserRole.SUPER_ADMIN) {
    const overrideOrgId = req.headers['x-organization-id'] as string;
    if (overrideOrgId) {
      req.organizationId = overrideOrgId;
      return next();
    }
  }

  // Enforce the user's bound organization
  if (!req.user.organizationId) {
    return next(new ForbiddenError('No organization associated with this account'));
  }

  req.organizationId = req.user.organizationId;

  // Prevent client injection attacks: if client supplied organizationId in query or body, verify it matches
  if (req.body && req.body.organizationId && req.body.organizationId !== req.organizationId) {
    return next(new ForbiddenError('Illegal cross-tenant payload detected'));
  }
  if (req.query && req.query.organizationId && req.query.organizationId !== req.organizationId) {
    return next(new ForbiddenError('Illegal cross-tenant query detected'));
  }

  next();
};

/**
 * Helper to ensure any database query filter is strictly confined to the current tenant
 */
export const scopeToTenant = (req: Request, query: Record<string, any> = {}): Record<string, any> => {
  if (!req.organizationId) {
    throw new ForbiddenError('Tenant scope missing');
  }
  return {
    ...query,
    organizationId: req.organizationId,
  };
};

/**
 * Asserts that a retrieved document belongs to the active tenant
 */
export const assertTenantOwnership = (doc: { organizationId?: any }, req: Request): void => {
  if (!doc || !doc.organizationId) {
    throw new ForbiddenError('Resource does not contain tenant ownership');
  }
  const docOrgId = doc.organizationId.toString();
  if (docOrgId !== req.organizationId) {
    throw new ForbiddenError('Cross-tenant resource access violation', 'TENANT_ISOLATION_VIOLATION');
  }
};
