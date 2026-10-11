import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ticketApi } from '@/services/api/ticketApi';
import {
  Headphones,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Smile,
  BookOpen,
  Send,
  Edit3,
  Check,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatTimeAgo, formatDeadline, getPriorityColor } from '@/utils';

export const AgentWorkspacePage: React.FC = () => {
  const { data } = useQuery({
    queryKey: ['agent-workspace-tickets'],
    queryFn: () => ticketApi.getTickets({ assignedAgentId: 'usr-4' }),
  });

  const tickets = data?.tickets || [];
  const [selectedTicket, setSelectedTicket] = useState(tickets[0] || null);
  const [copilotDraft, setCopilotDraft] = useState('');
  const [isSent, setIsSent] = useState(false);

  // Sync draft when ticket changes
  React.useEffect(() => {
    if (selectedTicket) {
      setCopilotDraft(selectedTicket.suggestedResponse);
      setIsSent(false);
    }
  }, [selectedTicket]);

  const handleAcceptAndSend = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Agent Workspace & AI Copilot
            <Badge variant="purple" className="text-xs">Live Desk</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assigned queue, SLA warning countdowns, and real-time AI copilot response suggestions
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Assigned Tickets', val: '6', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Pending Review', val: '2', color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Resolved Today', val: '14', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'SLA Warnings', val: '1', color: 'text-rose-400', bg: 'bg-rose-500/10' },
          { label: 'Agent CSAT', val: '97.4%', color: 'text-teal-400', bg: 'bg-teal-500/10' },
          { label: 'Avg Response', val: '1.8 min', color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
            <span className="text-[11px] font-medium text-slate-400 block">{kpi.label}</span>
            <span className="text-lg font-bold text-white mt-1 block">{kpi.val}</span>
          </div>
        ))}
      </div>

      {/* Main Workspace Split: Left Queue, Right AI Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Assigned Tickets Queue */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-0 overflow-hidden">
            <CardHeader className="p-3.5 m-0 border-b border-slate-800 bg-slate-900/60">
              <CardTitle className="text-xs flex items-center justify-between">
                <span>Active Assigned Queue (Devon Miles)</span>
                <span className="text-indigo-400 font-mono">{tickets.length} tickets</span>
              </CardTitle>
            </CardHeader>
            <div className="divide-y divide-slate-800/60 max-h-[560px] overflow-y-auto">
              {tickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                const sla = formatDeadline(t.slaDeadline);
                const pColor = getPriorityColor(t.priority);

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-3.5 cursor-pointer transition-all border-l-2 text-left ${
                      isSelected
                        ? 'bg-slate-800/70 border-l-indigo-500'
                        : 'hover:bg-slate-800/40 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {t.ticketNumber}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${pColor.bg}`}>
                        {t.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                      {t.subject}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>{t.customerName}</span>
                      <span className={`font-mono font-bold ${sla.isUrgent ? 'text-rose-400' : 'text-slate-400'}`}>
                        {sla.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: AI Copilot Engine */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTicket ? (
            <Card className="p-5 border-indigo-500/40 bg-slate-900/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      AI Copilot for {selectedTicket.ticketNumber}
                      <Badge variant="purple" className="text-[10px]">96% Match</Badge>
                    </h3>
                    <p className="text-[11px] text-slate-400">Contextual resolution recommendation</p>
                  </div>
                </div>

                {isSent && (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" /> Sent to Customer
                  </span>
                )}
              </div>

              {/* Copilot Suggestion 1: Suggested Response (Editable) */}
              <div className="space-y-2 text-xs">
                <label className="block text-slate-300 font-semibold flex items-center justify-between">
                  <span>1. Copilot Suggested Response (Live Editable)</span>
                  <span className="text-[10px] text-indigo-400">Accept, Edit, or Send</span>
                </label>
                <textarea
                  rows={4}
                  value={copilotDraft}
                  onChange={(e) => setCopilotDraft(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs text-slate-100 font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCopilotDraft(selectedTicket.suggestedResponse)}
                    leftIcon={<RotateCcwIcon className="w-3.5 h-3.5" />}
                  >
                    Reset Suggestion
                  </Button>
                  <Button
                    variant="glow"
                    size="sm"
                    onClick={handleAcceptAndSend}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Accept & Send Response
                  </Button>
                </div>
              </div>

              {/* Copilot Suggestion 2: Relevant Knowledge Base Articles */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Suggested Knowledge Base Articles
                </span>
                <div className="space-y-1.5">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>Enterprise Refund & Return Policy (Hardware & Licenses)</span>
                    <Badge variant="success" className="text-[9px]">98% Relevance</Badge>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-300">
                    <span>SLA Guarantees, Priority Escalations & Business Hours</span>
                    <Badge variant="purple" className="text-[9px]">91% Relevance</Badge>
                  </div>
                </div>
              </div>

              {/* Copilot Suggestion 3: Next Recommended Action & Similar Tickets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Recommended Next Action</span>
                  <p className="font-semibold text-emerald-400 text-xs mt-1">
                    {selectedTicket.recommendedAction}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Similar Historical Tickets</span>
                  <div className="mt-1 space-y-1 text-slate-300">
                    <span className="block truncate text-indigo-400">#TKT-8412 — Chicago freight hold (Resolved in 18m)</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 text-xs">
              Select a ticket from the left queue to activate AI Copilot suggestions.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

const RotateCcwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);
