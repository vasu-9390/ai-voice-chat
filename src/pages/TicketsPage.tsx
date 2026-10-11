import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketApi, GetTicketsParams } from '@/services/api/ticketApi';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Kanban,
  List,
  AlertCircle,
  CheckCircle2,
  User,
  ShieldAlert,
  Zap,
  TrendingUp,
  Tag,
  CornerDownRight,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  formatTimeAgo,
  formatDeadline,
  getPriorityColor,
  getStatusBadge,
  cn,
} from '@/utils';

export const TicketsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('table');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [copiedAction, setCopiedAction] = useState(false);

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TicketStatus }) =>
      ticketApi.updateTicketStatus(id, status),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setSelectedTicket(updated);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['tickets', statusFilter, priorityFilter, search],
    queryFn: () =>
      ticketApi.getTickets({
        status: statusFilter,
        priority: priorityFilter,
        search,
      }),
  });

  const tickets = data?.tickets || [];

  const statuses: TicketStatus[] = [
    'NEW',
    'OPEN',
    'IN_PROGRESS',
    'WAITING_FOR_CUSTOMER',
    'ESCALATED',
    'RESOLVED',
    'CLOSED',
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Ticket Management & AI Insights
            <Badge variant="purple" className="text-xs">SLA Engine</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track customer requests, SLA countdown deadlines, AI confidence scoring, and automated copilot actions
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors',
                viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              <List className="w-3.5 h-3.5" /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors',
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              )}
            >
              <Kanban className="w-3.5 h-3.5" /> Kanban
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>

          {/* Priority selector */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent SLA</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, subject, customer..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* TABLE VIEW */}
      {viewMode === 'table' ? (
        <Card className="p-0 overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">Ticket ID</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">AI Confidence</th>
                  <th className="py-3 px-4 font-semibold">SLA Deadline</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((t) => {
                  const pColor = getPriorityColor(t.priority);
                  const sBadge = getStatusBadge(t.status);
                  const sla = formatDeadline(t.slaDeadline);

                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-indigo-400">
                        {t.ticketNumber}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-200">
                        {t.subject}
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {t.customerName}
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('px-2 py-0.5 rounded-full border text-[10px] font-semibold', pColor.bg)}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('px-2 py-0.5 rounded-full border text-[10px] font-semibold', sBadge.color)}>
                          {sBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-purple-400">{t.aiConfidence}%</span>
                          <Sparkles className="w-3 h-3 text-purple-400" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('font-mono font-medium', sla.isUrgent ? 'text-rose-400 font-bold' : 'text-slate-400')}>
                          {sla.text}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-[11px]">
                          Inspect AI <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {(['OPEN', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED'] as TicketStatus[]).map((colStatus) => {
            const colTickets = tickets.filter((t) => t.status === colStatus);
            const badge = getStatusBadge(colStatus);

            return (
              <div
                key={colStatus}
                className="bg-slate-900/60 rounded-xl border border-slate-800/80 p-3 flex flex-col min-h-[480px]"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <span className={cn('text-xs font-bold px-2 py-0.5 rounded border', badge.color)}>
                    {badge.label}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono font-semibold">
                    {colTickets.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colTickets.map((t) => {
                    const pColor = getPriorityColor(t.priority);
                    const sla = formatDeadline(t.slaDeadline);

                    return (
                      <div
                        key={t.id}
                        onClick={() => setSelectedTicket(t)}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all shadow-sm flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-indigo-400">
                            {t.ticketNumber}
                          </span>
                          <span className={cn('px-1.5 py-0.2 rounded text-[10px] font-semibold border', pColor.bg)}>
                            {t.priority}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-200 line-clamp-2">
                          {t.subject}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                          <span>{t.customerName}</span>
                          <span className={cn('font-mono font-bold', sla.isUrgent ? 'text-rose-400' : 'text-slate-400')}>
                            {sla.text}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 12: AI TICKET DETAILS MODAL */}
      {selectedTicket && (
        <Modal
          isOpen={!!selectedTicket}
          onClose={() => setSelectedTicket(null)}
          title={`Ticket ${selectedTicket.ticketNumber} — AI Diagnostics & Action`}
          description={selectedTicket.subject}
          maxWidth="2xl"
        >
          <div className="space-y-5 text-xs">
            {/* Top Diagnostic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Customer Intent</span>
                <span className="font-semibold text-indigo-400 text-xs mt-0.5 block">{selectedTicket.customerIntent}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Customer Sentiment</span>
                <span className={`font-semibold text-xs mt-0.5 block ${selectedTicket.sentiment === 'Frustrated' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedTicket.sentiment}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">AI Confidence</span>
                <span className="font-semibold text-purple-400 text-xs mt-0.5 flex items-center gap-1">
                  {selectedTicket.aiConfidence}% <Sparkles className="w-3 h-3" />
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">SLA Status</span>
                <span className="font-semibold text-amber-400 text-xs mt-0.5 block">
                  {formatDeadline(selectedTicket.slaDeadline).text}
                </span>
              </div>
            </div>

            {/* AI Executive Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-xs font-bold text-slate-200 block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Executive Summary
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {selectedTicket.aiSummary}
              </p>
            </div>

            {/* Priority Reason */}
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wide block mb-0.5">
                Priority Assessment Rationale
              </span>
              <p className="text-rose-200/90 text-xs">
                {selectedTicket.priorityReason}
              </p>
            </div>

            {/* Suggested Response */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-indigo-400" /> Copilot Suggested Response
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTicket.suggestedResponse);
                    setCopiedAction(true);
                    setTimeout(() => setCopiedAction(false), 2000);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-200 flex items-center gap-1"
                >
                  {copiedAction ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedAction ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-indigo-500/20">
                "{selectedTicket.suggestedResponse}"
              </p>
            </div>

            {/* Recommended Action & Status Transitions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-left w-full sm:w-auto">
                <span className="text-[10px] text-slate-400 block">Recommended Autonomous Action:</span>
                <span className="font-semibold text-emerald-400 text-xs">{selectedTicket.recommendedAction}</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                  value={selectedTicket.status}
                  onChange={(e) =>
                    statusMutation.mutate({
                      id: selectedTicket.id,
                      status: e.target.value as TicketStatus,
                    })
                  }
                  className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-200 font-semibold"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st}>{st.replace('_', ' ')}</option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    statusMutation.mutate({
                      id: selectedTicket.id,
                      status: 'RESOLVED',
                    });
                  }}
                  isLoading={statusMutation.isPending}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Resolve Ticket
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
