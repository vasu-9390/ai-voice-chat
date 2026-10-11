export enum TicketStatus {
  NEW = 'NEW',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_FOR_CUSTOMER = 'WAITING_FOR_CUSTOMER',
  ESCALATED = 'ESCALATED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ConversationStatus {
  OPEN = 'OPEN',
  AI_HANDLING = 'AI_HANDLING',
  HUMAN_HANDLING = 'HUMAN_HANDLING',
  WAITING = 'WAITING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum SubscriptionPlan {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
}

// SLA Thresholds in Milliseconds
export const SLA_DURATIONS_MS: Record<TicketPriority, number> = {
  [TicketPriority.URGENT]: 15 * 60 * 1000, // 15 mins
  [TicketPriority.HIGH]: 60 * 60 * 1000, // 1 hour
  [TicketPriority.MEDIUM]: 4 * 60 * 60 * 1000, // 4 hours
  [TicketPriority.LOW]: 24 * 60 * 60 * 1000, // 24 hours
};

// Plan Monthly Quotas
export const PLAN_LIMITS: Record<SubscriptionPlan, { maxAiConversations: number; maxVoiceMinutes: number; maxAgents: number }> = {
  [SubscriptionPlan.FREE]: { maxAiConversations: 250, maxVoiceMinutes: 30, maxAgents: 1 },
  [SubscriptionPlan.PRO]: { maxAiConversations: 5000, maxVoiceMinutes: 500, maxAgents: 5 },
  [SubscriptionPlan.BUSINESS]: { maxAiConversations: 25000, maxVoiceMinutes: 2500, maxAgents: 20 },
  [SubscriptionPlan.ENTERPRISE]: { maxAiConversations: 1000000, maxVoiceMinutes: 100000, maxAgents: 1000 },
};
