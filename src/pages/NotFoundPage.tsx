import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, AlertCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">404</h1>
      <h2 className="text-lg font-semibold text-slate-300 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 mb-8 max-w-sm">
        The requested enterprise portal route or resource does not exist or may have been migrated.
      </p>
      <div className="flex gap-3">
        <Link to="/app/dashboard">
          <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
            Back to Dashboard
          </Button>
        </Link>
        <Link to="/">
          <Button variant="outline" size="md">
            Landing Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const ServerErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-slate-100 selection:bg-indigo-500 selection:text-white">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">500</h1>
      <h2 className="text-lg font-semibold text-slate-300 mt-2">Internal Telemetry Exception</h2>
      <p className="text-xs text-slate-500 mt-1 mb-8 max-w-sm">
        An unexpected error occurred while communicating with the autonomous edge cluster.
      </p>
      <div className="flex gap-3">
        <Button variant="primary" size="md" onClick={() => window.location.reload()}>
          Retry Telemetry Connection
        </Button>
        <Link to="/app/dashboard">
          <Button variant="outline" size="md">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
