import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Headphones, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchRole } = useAuthStore();

  const [email, setEmail] = useState('marcus.v@acmecorp.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = async (role: UserRole) => {
    setLoading(true);
    switchRole(role);
    setTimeout(() => {
      setLoading(false);
      navigate('/app/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">CogniVoice AI</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Sign in to Enterprise Workspace</h2>
        <p className="mt-1 text-xs text-slate-400">
          Enter your corporate credentials or select a demo role below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          {/* Quick Demo Role Picker Buttons */}
          <div className="mb-6 p-3 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              ⚡ 1-Click Demo Login by Role:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('ORG_ADMIN')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700/60 text-left transition-colors"
              >
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium truncate">Org Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('SUPPORT_AGENT')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700/60 text-left transition-colors"
              >
                <Headphones className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-medium truncate">Support Agent</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('TEAM_MANAGER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700/60 text-left transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-medium truncate">Team Manager</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('CUSTOMER')}
                className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500 text-slate-200 border border-slate-700/60 text-left transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-medium truncate">Customer</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-400">
                <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-indigo-600" />
                Remember this device
              </label>
              <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 font-medium">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="md"
              className="w-full"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Platform
            </Button>
          </form>

          {/* OAuth Buttons */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-slate-900 px-2 text-slate-500">Or continue with SSO</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('ORG_ADMIN')}
                className="w-full py-2 px-3 border border-slate-800 rounded-lg bg-slate-950/60 hover:bg-slate-850 text-slate-300 font-medium transition-colors"
              >
                Google Workspace
              </button>
              <button
                type="button"
                onClick={() => handleQuickRoleLogin('ORG_ADMIN')}
                className="w-full py-2 px-3 border border-slate-800 rounded-lg bg-slate-950/60 hover:bg-slate-850 text-slate-300 font-medium transition-colors"
              >
                Okta / SAML SSO
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Don't have an enterprise account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
