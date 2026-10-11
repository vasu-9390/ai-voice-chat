import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/services/api/authApi';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.resetPassword('sample-token', password);
      setSuccess(true);
    } catch {
      setError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">CogniVoice AI</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Set New Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl backdrop-blur-md">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Password Updated</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                Your new password has been saved. You can now log into your workspace.
              </p>
              <Button variant="primary" size="md" className="w-full" onClick={() => navigate('/login')}>
                Sign In Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                  {error}
                </div>
              )}
              <Input
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                required
              />
              <Button type="submit" variant="primary" size="md" className="w-full" isLoading={loading}>
                Update Password
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = async () => {
    setVerifying(true);
    await authApi.verifyEmail('token-123');
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-indigo-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">CogniVoice AI</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Email Verification</h2>
        <p className="mt-1 text-xs text-slate-400">
          Verify your email address to activate all enterprise agent features
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl backdrop-blur-md text-center">
          {verified ? (
            <div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white">Email Successfully Verified!</h3>
              <p className="text-xs text-slate-400 mt-2 mb-6">
                Your enterprise workspace has been authorized.
              </p>
              <Button variant="glow" size="md" className="w-full" onClick={() => navigate('/app/dashboard')}>
                Enter Dashboard
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                Click below to simulate immediate email verification token confirmation for your organization.
              </p>
              <Button variant="primary" size="md" className="w-full mb-3" isLoading={verifying} onClick={handleVerify}>
                Confirm Verification Token
              </Button>
              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/app/dashboard')}>
                Skip to Dashboard (Demo)
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
