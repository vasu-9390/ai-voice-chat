import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, switchRole } = useAuthStore();
  const role = user?.role;

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-100">403 - Access Restricted</h2>
        <p className="text-xs text-slate-400 mt-2 mb-6 leading-relaxed">
          Your current role (<span className="text-rose-400 font-semibold">{role || 'GUEST'}</span>) does not have authorization to view this enterprise portal section.
        </p>
        <div className="flex flex-col gap-2 w-full">
          <p className="text-[11px] text-slate-500">Allowed roles: {allowedRoles.join(', ')}</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => switchRole(allowedRoles[0])}
            className="w-full"
          >
            Switch to {allowedRoles[0].replace('_', ' ')} (Demo)
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
