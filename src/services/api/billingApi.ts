import { apiClient } from './client';
import { BillingPlan } from '@/types';

export interface BillingUsage {
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  billingCycle: 'monthly' | 'annual';
  currentPeriodEnd: string;
  usage: {
    aiConversations: { current: number; max: number };
    voiceMinutes: { current: number; max: number };
    tickets: { current: number; max: number };
    knowledgeDocs: { current: number; max: number };
    teamMembers: { current: number; max: number };
  };
  invoices: {
    id: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Processing';
    pdfUrl: string;
  }[];
}

export const billingPlans: BillingPlan[] = [
  {
    id: 'free',
    name: 'Starter Developer',
    description: 'Perfect for prototyping AI customer voice workflows and testing autonomous bots.',
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      'Up to 250 AI conversations / mo',
      '30 voice support minutes / mo',
      '1 Knowledge Base document',
      'Single agent seat',
      'Community Slack support',
      'Standard WebRTC latency',
    ],
    limits: {
      aiConversations: 250,
      voiceMinutes: 30,
      tickets: 50,
      knowledgeDocs: 1,
      teamSeats: 1,
    },
  },
  {
    id: 'pro',
    name: 'Growth Pro',
    description: 'For growing e-commerce and SaaS teams automating everyday customer requests.',
    monthlyPrice: 79,
    annualPrice: 65,
    features: [
      '5,000 AI conversations / mo',
      '500 voice support minutes / mo',
      '25 Knowledge Base documents',
      'Up to 5 team agent seats',
      'Autonomous tool calling & CRM sync',
      'Low-latency Opus voice streaming (< 500ms)',
      'Custom email & chat channels',
    ],
    limits: {
      aiConversations: 5000,
      voiceMinutes: 500,
      tickets: 1000,
      knowledgeDocs: 25,
      teamSeats: 5,
    },
  },
  {
    id: 'business',
    name: 'Scale Business',
    description: 'High-throughput enterprise AI support with unlimited agents and custom escalation routing.',
    monthlyPrice: 249,
    annualPrice: 199,
    features: [
      '25,000 AI conversations / mo',
      '2,500 voice support minutes / mo',
      '150 Knowledge Base documents',
      'Up to 20 team agent seats',
      'Custom tool runner & webhooks',
      '99.9% Uptime SLA Guarantee',
      'Dedicated Slack connect & CSM',
      'Role-based permissions & audit log',
    ],
    limits: {
      aiConversations: 25000,
      voiceMinutes: 2500,
      tickets: 5000,
      knowledgeDocs: 150,
      teamSeats: 20,
    },
  },
  {
    id: 'enterprise',
    name: 'Custom Enterprise',
    description: 'For Fortune 500 organizations requiring dedicated VPC, custom LLM fine-tuning, and HIPAA/SOC2.',
    monthlyPrice: 799,
    annualPrice: 649,
    features: [
      'Unlimited AI conversations',
      'Unlimited real-time voice minutes',
      'Unlimited vector knowledge docs',
      'Unlimited seat licenses',
      'Custom VPC on AWS/GCP/Azure',
      'Fine-tuned enterprise model weights',
      '15-minute response human SLA',
      'Dedicated Solutions Architect',
    ],
    limits: {
      aiConversations: 100000,
      voiceMinutes: 10000,
      tickets: 25000,
      knowledgeDocs: 1000,
      teamSeats: 100,
    },
  },
];

let billingUsageStore: BillingUsage = {
  plan: 'business',
  billingCycle: 'monthly',
  currentPeriodEnd: '2026-11-01T00:00:00Z',
  usage: {
    aiConversations: { current: 14820, max: 25000 },
    voiceMinutes: { current: 1340, max: 2500 },
    tickets: { current: 2840, max: 5000 },
    knowledgeDocs: { current: 38, max: 150 },
    teamMembers: { current: 8, max: 20 },
  },
  invoices: [
    { id: 'INV-2026-009', date: '2026-10-01', amount: 249, status: 'Paid', pdfUrl: '#' },
    { id: 'INV-2026-008', date: '2026-09-01', amount: 249, status: 'Paid', pdfUrl: '#' },
    { id: 'INV-2026-007', date: '2026-08-01', amount: 249, status: 'Paid', pdfUrl: '#' },
  ],
};

export const billingApi = {
  async getUsage(): Promise<BillingUsage> {
    try {
      const { data } = await apiClient.get<BillingUsage>('/billing/usage');
      return data;
    } catch {
      return { ...billingUsageStore };
    }
  },

  async updatePlan(planId: BillingPlan['id']): Promise<BillingUsage> {
    try {
      const { data } = await apiClient.post<BillingUsage>('/billing/change-plan', { planId });
      return data;
    } catch {
      billingUsageStore = {
        ...billingUsageStore,
        plan: planId,
      };
      return { ...billingUsageStore };
    }
  },
};
