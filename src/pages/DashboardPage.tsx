import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, AnalyticsFilterParams } from '@/services/api/analyticsApi';
import {
  Ticket,
  CheckCircle2,
  Clock,
  Zap,
  Smile,
  AlertTriangle,
  MessageSquare,
  PhoneCall,
  Calendar,
  Filter,
  Users,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const DashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilterParams>({
    dateRange: '7d',
    teamId: 'all',
    agentId: 'all',
    priority: 'all',
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery({
    queryKey: ['dashboard-metrics', filters],
    queryFn: () => analyticsApi.getDashboardMetrics(filters),
  });

  const { data: trends } = useQuery({
    queryKey: ['volume-trends', filters],
    queryFn: () => analyticsApi.getVolumeTrends(filters),
  });

  const { data: categories } = useQuery({
    queryKey: ['category-distribution'],
    queryFn: () => analyticsApi.getCategoryDistribution(),
  });

  const { data: agents } = useQuery({
    queryKey: ['agent-leaderboard'],
    queryFn: () => analyticsApi.getAgentLeaderboard(),
  });

  const statCards = [
    { label: 'Total Tickets', val: metrics?.totalTickets ?? 1248, icon: Ticket, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Open Tickets', val: metrics?.openTickets ?? 42, icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Resolved Tickets', val: metrics?.resolvedTickets ?? 1206, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Avg Response Time', val: `${metrics?.avgResponseTimeMin ?? 1.4} min`, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Avg Resolution Time', val: `${metrics?.avgResolutionTimeHours ?? 2.8} hrs`, icon: Clock, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'AI Resolution Rate', val: `${metrics?.aiResolutionRatePct ?? 76.4}%`, icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Customer CSAT', val: `${metrics?.csatScorePct ?? 94.2}%`, icon: Smile, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Escalated Tickets', val: metrics?.escalatedTickets ?? 18, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Active Conversations', val: metrics?.activeConversations ?? 31, icon: MessageSquare, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Voice Calls Today', val: metrics?.voiceCallsToday ?? 184, icon: PhoneCall, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Executive Operations Dashboard
            <Badge variant="purple" className="text-xs">Live Telemetry</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Omnichannel ticket volumes, AI vs. human resolution velocities, and automated agent KPIs
          </p>
        </div>

        {/* Enterprise Filtering Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['today', '7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setFilters({ ...filters, dateRange: r })}
                className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                  filters.dateRange === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'today' ? 'Today' : r}
              </button>
            ))}
          </div>

          {/* Team filter */}
          <select
            value={filters.teamId}
            onChange={(e) => setFilters({ ...filters, teamId: e.target.value })}
            className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Teams</option>
            <option value="tier1">Tier 1 Voice Desk</option>
            <option value="tier2">Tier 2 Technical</option>
            <option value="billing">Enterprise Billing</option>
          </select>

          {/* Priority filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">All Priorities</option>
            <option value="URGENT">Urgent SLA</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* 10 Enterprise Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {statCards.map((c, i) => (
          <Card key={i} className="p-4 bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-400 truncate">{c.label}</span>
              <div className={`p-1.5 rounded-lg ${c.bg} ${c.color}`}>
                <c.icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-white mt-2 tracking-tight">{c.val}</p>
          </Card>
        ))}
      </div>

      {/* Charts Grid Row 1: Ticket Volume Trend & AI vs Human Resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Volume & AI Resolution Velocity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Ticket Ingestion & Resolution Volume</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Autonomous AI resolution compared with human-assisted tickets</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> AI Handled
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Human
              </span>
            </div>
          </CardHeader>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="humanGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="aiResolved" name="AI Resolved" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#aiGradient)" />
                <Area type="monotone" dataKey="humanResolved" name="Human Resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#humanGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Category Breakdown Donut */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Ticket Categories</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Distribution across functional domains</p>
            </div>
          </CardHeader>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {(categories || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {(categories || []).slice(0, 4).map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name}
                </span>
                <span className="font-semibold text-slate-200">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Grid Row 2: Voice Calls & Agent Performance Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voice AI Calls volume bar chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div>
              <CardTitle>Voice AI Call Ingestion</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Live telephony & WebRTC audio sessions</p>
            </div>
          </CardHeader>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="voiceCalls" name="Voice Calls" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Agent Performance Leaderboard Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Support Agent Performance & AI Copilot Adoption</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Human team metrics assisted by autonomous copilot suggestions</p>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="pb-3 font-medium">Agent</th>
                  <th className="pb-3 font-medium">Tickets Resolved</th>
                  <th className="pb-3 font-medium">Avg Response</th>
                  <th className="pb-3 font-medium">CSAT Score</th>
                  <th className="pb-3 font-medium">AI Copilot Adoption</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(agents || []).map((agent) => (
                  <tr key={agent.id} className="hover:bg-slate-800/40">
                    <td className="py-3 flex items-center gap-2.5">
                      <img src={agent.avatar} alt={agent.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="font-semibold text-slate-200">{agent.name}</span>
                    </td>
                    <td className="py-3 text-slate-200 font-medium">{agent.ticketsResolved}</td>
                    <td className="py-3 text-slate-300">{agent.avgResponseMins} min</td>
                    <td className="py-3">
                      <span className="text-emerald-400 font-semibold">{agent.csatScore}%</span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${agent.aiAssistedPct}%` }}
                          />
                        </div>
                        <span className="text-slate-400">{agent.aiAssistedPct}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
