import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi, AnalyticsFilterParams } from '@/services/api/analyticsApi';
import {
  BarChart3,
  TrendingUp,
  Zap,
  Smile,
  Clock,
  PhoneCall,
  Calendar,
  AlertTriangle,
  Award,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
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

export const AnalyticsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d');

  const { data: metrics } = useQuery({
    queryKey: ['analytics-metrics', dateRange],
    queryFn: () => analyticsApi.getDashboardMetrics({ dateRange }),
  });

  const { data: trends } = useQuery({
    queryKey: ['analytics-trends', dateRange],
    queryFn: () => analyticsApi.getVolumeTrends({ dateRange }),
  });

  const { data: categories } = useQuery({
    queryKey: ['analytics-categories'],
    queryFn: () => analyticsApi.getCategoryDistribution(),
  });

  const { data: agents } = useQuery({
    queryKey: ['analytics-agents'],
    queryFn: () => analyticsApi.getAgentLeaderboard(),
  });

  // Simulated accuracy & CSAT trend
  const accuracyTrend = [
    { day: 'W1', aiAccuracy: 92.4, csat: 91.0, escalationRate: 8.2 },
    { day: 'W2', aiAccuracy: 94.1, csat: 92.5, escalationRate: 6.4 },
    { day: 'W3', aiAccuracy: 95.8, csat: 93.8, escalationRate: 4.8 },
    { day: 'W4', aiAccuracy: 97.2, csat: 95.4, escalationRate: 3.5 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Advanced Analytics & Intelligence
            <Badge variant="purple" className="text-xs">Deep Metrics</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Historical trends across autonomous AI resolution, escalation containment, and telephony accuracy
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          {(['today', '7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`px-3 py-1.5 rounded-md font-medium capitalize transition-colors ${
                dateRange === r ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r === 'today' ? 'Today' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 6 High-Level Statistical KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Conversations', val: '14,820', sub: '+18% vs last month', color: 'text-indigo-400' },
          { label: 'AI Resolution Rate', val: '76.4%', sub: 'Target: > 70%', color: 'text-purple-400' },
          { label: 'Human Resolution Rate', val: '23.6%', sub: 'Tier 1 & 2 desk', color: 'text-emerald-400' },
          { label: 'Escalation Rate', val: '3.5%', sub: '-2.1% drop', color: 'text-amber-400' },
          { label: 'AI Model Accuracy', val: '97.2%', sub: 'Confidence >= 85%', color: 'text-teal-400' },
          { label: 'Overall CSAT Score', val: '94.2%', sub: '4.8 / 5.0 rating', color: 'text-pink-400' },
        ].map((kpi, i) => (
          <Card key={i} className="p-4 bg-slate-900/60 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 block">{kpi.label}</span>
            <span className={`text-xl font-bold mt-1.5 block tracking-tight ${kpi.color}`}>{kpi.val}</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">{kpi.sub}</span>
          </Card>
        ))}
      </div>

      {/* Charts Grid Row 1: Line Chart (AI Accuracy vs CSAT) & Area Chart (Ticket Volume) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart: Accuracy & CSAT Evolution */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>AI Accuracy & Customer CSAT Correlation</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Line chart tracking model confidence alongside CSAT ratings</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" domain={[85, 100]} fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="aiAccuracy" name="AI Model Accuracy (%)" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="csat" name="Customer CSAT (%)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Area Chart: Omnichannel Ticket Ingestion Volume */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Omnichannel Ingestion Volume</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Area chart showing daily customer ticket creation volume</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="totalTickets" name="Total Ingested Tickets" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#volGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Charts Grid Row 2: Bar Chart (Voice Telephony Calls) & Pie Chart (Domain Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Voice Telephony & WebRTC Call Ingestion</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Bar chart breaking down duplex AI phone calls handled daily</p>
            </div>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="voiceCalls" name="Voice Calls Handled" fill="#ec4899" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Inquiry Distribution</CardTitle>
              <p className="text-xs text-slate-400 mt-0.5">Pie chart of tickets by department</p>
            </div>
          </CardHeader>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, percent }: any) => `${(name || '').split(' ')[0]} ${(((percent || 0) * 100)).toFixed(0)}%`}
                >
                  {(categories || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
