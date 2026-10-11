import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Sparkles, Mail, Lock, User, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@/types';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [role, setRole] = useState<UserRole>('ORG_ADMIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !organizationName) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register({ name, email, password, organizationName, role });
      navigate('/verify-email');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">CogniVoice AI</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Create Enterprise Organization</h2>
        <p className="mt-1 text-xs text-slate-400">
          Get started with automated voice agents and AI support in minutes
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl backdrop-blur-md">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elena Vance"
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@company.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Organization Name"
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="Acme Global Inc"
              leftIcon={<Building className="w-4 h-4 text-slate-400" />}
              required
            />

            <Input
              label="Password (min. 8 characters)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-medium text-slate-300">Initial Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full rounded-lg bg-slate-900 border border-slate-700/80 px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ORG_ADMIN">Organization Admin (Owner)</option>
                <option value="TEAM_MANAGER">Team Manager</option>
                <option value="SUPPORT_AGENT">Support Agent</option>
                <option value="CUSTOMER">Customer / Client</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="glow"
              size="md"
              className="w-full mt-2"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start 14-Day Free Trial
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
