import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingApi, billingPlans } from '@/services/api/billingApi';
import {
  CreditCard,
  Sparkles,
  Zap,
  Mic,
  Ticket,
  BookOpen,
  Users,
  Check,
  ArrowRight,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import confetti from 'canvas-confetti';

export const BillingPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<string | null>(null);

  const { data: usage, isLoading } = useQuery({
    queryKey: ['billing-usage'],
    queryFn: () => billingApi.getUsage(),
  });

  const upgradeMutation = useMutation({
    mutationFn: (planId: any) => billingApi.updatePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing-usage'] });
      setSelectedPlanForUpgrade(null);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    },
  });

  const currentPlan = usage?.plan || 'business';

  const usageItems = [
    {
      label: 'AI Support Conversations',
      current: usage?.usage.aiConversations.current ?? 14820,
      max: usage?.usage.aiConversations.max ?? 25000,
      icon: Sparkles,
      color: 'from-indigo-500 to-purple-500',
    },
    {
      label: 'Voice AI Minutes',
      current: usage?.usage.voiceMinutes.current ?? 1340,
      max: usage?.usage.voiceMinutes.max ?? 2500,
      icon: Mic,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Monthly Support Tickets',
      current: usage?.usage.tickets.current ?? 2840,
      max: usage?.usage.tickets.max ?? 5000,
      icon: Ticket,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Vector Knowledge Documents',
      current: usage?.usage.knowledgeDocs.current ?? 38,
      max: usage?.usage.knowledgeDocs.max ?? 150,
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Active Team Member Seats',
      current: usage?.usage.teamMembers.current ?? 8,
      max: usage?.usage.teamMembers.max ?? 20,
      icon: Users,
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Subscription, Usage & Invoicing
            <Badge variant="purple" className="text-xs uppercase">{currentPlan} Plan</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor real-time consumption quotas, manage team tiers, and download tax invoices
          </p>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
              billingCycle === 'annual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] px-1 rounded bg-emerald-500/20 text-emerald-400 font-bold">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Real-time Usage Progress Bars */}
      <Card>
        <CardHeader>
          <CardTitle>Current Monthly Usage Quotas</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          {usageItems.map((item, idx) => {
            const pct = Math.min(100, Math.round((item.current / item.max) * 100));
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <item.icon className="w-3.5 h-3.5 text-indigo-400" /> {item.label}
                  </span>
                  <span className="font-mono text-slate-400 font-bold">{pct}%</span>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${item.color} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{item.current.toLocaleString()} used</span>
                  <span>{item.max.toLocaleString()} limit</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Subscription Plans Tier Matrix */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Subscription Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {billingPlans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

            return (
              <Card
                key={plan.id}
                className={`p-5 flex flex-col justify-between transition-all ${
                  isCurrent ? 'border-2 border-indigo-500 bg-slate-900/90 shadow-xl' : 'bg-slate-900/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">{plan.name}</h3>
                    {isCurrent && <Badge variant="purple" className="text-[9px]">Current Plan</Badge>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 min-h-[34px]">{plan.description}</p>

                  <div className="my-4">
                    <span className="text-2xl font-extrabold text-white">${price}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300 pb-4 border-b border-slate-800/80">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4">
                  <Button
                    variant={isCurrent ? 'outline' : 'glow'}
                    size="sm"
                    disabled={isCurrent}
                    onClick={() => setSelectedPlanForUpgrade(plan.id)}
                    className="w-full"
                  >
                    {isCurrent ? 'Active Plan' : plan.id === 'enterprise' ? 'Upgrade to Enterprise' : 'Switch Plan'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Invoices History Table */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="p-4 m-0 border-b border-slate-800">
          <CardTitle>Invoicing & Payment History</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Invoice ID</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(usage?.invoices || []).map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">{inv.id}</td>
                  <td className="py-3 px-4 text-slate-400">{inv.date}</td>
                  <td className="py-3 px-4 text-slate-200 font-bold">${inv.amount}.00</td>
                  <td className="py-3 px-4">
                    <Badge variant="success" className="text-[10px]">{inv.status}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Upgrade Confirmation Modal */}
      {selectedPlanForUpgrade && (
        <Modal
          isOpen={!!selectedPlanForUpgrade}
          onClose={() => setSelectedPlanForUpgrade(null)}
          title="Confirm Plan Upgrade"
          description={`Switch organization subscription to ${selectedPlanForUpgrade.toUpperCase()}`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">
              Your new plan benefits and increased AI conversation quotas will activate immediately. Prorated charges will reflect on your next billing statement.
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedPlanForUpgrade(null)}>
                Cancel
              </Button>
              <Button
                variant="glow"
                size="sm"
                onClick={() => upgradeMutation.mutate(selectedPlanForUpgrade)}
                isLoading={upgradeMutation.isPending}
              >
                Confirm Subscription Change
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
