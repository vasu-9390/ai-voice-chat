export type UserRole = 
  | 'CUSTOMER' 
  | 'SUPPORT_AGENT' 
  | 'TEAM_MANAGER' 
  | 'ORG_ADMIN' 
  | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
  organizationName?: string;
  department?: string;
  status?: 'ONLINE' | 'AWAY' | 'OFFLINE';
  createdAt: string;
}

export type TicketStatus = 
  | 'NEW' 
  | 'OPEN' 
  | 'IN_PROGRESS' 
  | 'WAITING_FOR_CUSTOMER' 
  | 'ESCALATED' 
  | 'RESOLVED' 
  | 'CLOSED';

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TicketCategory = 
  | 'Billing & Invoicing' 
  | 'Technical Support' 
  | 'Account Access' 
  | 'Product Inquiry' 
  | 'Refund Request' 
  | 'Feature Request';

export type SentimentType = 'Positive' | 'Neutral' | 'Frustrated' | 'Angry' | 'Delighted';

export interface Ticket {
  id: string;
  ticketNumber: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  assignedAgentId?: string;
  assignedAgentName?: string;
  aiConfidence: number; // 0-100
  sentiment: SentimentType;
  createdAt: string;
  updatedAt: string;
  slaDeadline: string; // ISO string
  aiSummary: string;
  customerIntent: string;
  priorityReason: string;
  suggestedResponse: string;
  recommendedAction: string;
  tags: string[];
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: 'Free' | 'Pro' | 'Business' | 'Enterprise';
  avatar: string;
  lifetimeValue: number;
  sentimentScore: number; // 0 - 100
  tags: string[];
  previousTicketsCount: number;
  orders: {
    id: string;
    date: string;
    amount: number;
    status: 'Delivered' | 'In Transit' | 'Refunded' | 'Processing';
    items: string;
  }[];
  notes?: string;
}

export type MessageSenderType = 'customer' | 'agent' | 'ai' | 'system';

export interface ToolExecutionEvent {
  toolName: string;
  status: 'running' | 'completed' | 'failed';
  timestamp: string;
  input?: Record<string, any>;
  output?: Record<string, any> | string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderType: MessageSenderType;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: {
    name: string;
    url: string;
    size: string;
    type: 'image' | 'file' | 'audio';
  }[];
  toolExecutions?: ToolExecutionEvent[];
  isStreaming?: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  feedback?: 'helpful' | 'not_helpful';
}

export interface Conversation {
  id: string;
  customer: CustomerProfile;
  lastMessage: string;
  lastMessageTimestamp: string;
  unreadCount: number;
  status: 'unassigned' | 'assigned' | 'ai_handled' | 'human_handled' | 'escalated' | 'waiting' | 'resolved';
  priority: TicketPriority;
  channel: 'web' | 'voice' | 'email' | 'whatsapp';
  assignedAgent?: string;
  assignedAgentAvatar?: string;
  ticketId?: string;
}

export type VoiceCallState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'AI_SPEAKING' | 'ENDED';

export interface VoiceTranscriptItem {
  id: string;
  speaker: 'customer' | 'ai' | 'system';
  text: string;
  timestamp: string;
  confidence?: number;
}

export interface AgentConfig {
  id: string;
  name: string;
  avatar: string;
  systemInstructions: string;
  tone: 'Professional' | 'Empathetic' | 'Concise' | 'Friendly' | 'Direct';
  creativityLevel: number; // 0-100
  supportedLanguages: string[];
  knowledgeSources: string[];
  allowedTools: {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
  }[];
  escalationRules: {
    escalateOnSentiment: boolean;
    escalateOnNegativeKeywords: boolean;
    maxAiAttemptsBeforeEscalate: number;
    confidenceThreshold: number;
  };
  businessHours: {
    enabled: boolean;
    start: string;
    end: string;
    timezone: string;
  };
  maxConversationLength: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  content: string;
  documentType: 'ARTICLE' | 'PDF' | 'DOCX' | 'TXT' | 'MARKDOWN';
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  processingStatus: 'INDEXED' | 'PROCESSING' | 'FAILED';
  embeddingStatus: 'VECTORIZED' | 'IN_PROGRESS' | 'PENDING';
  chunkCount: number;
  updatedAt: string;
  author: string;
  views: number;
  helpfulVotes: number;
}

export interface AppNotification {
  id: string;
  type: 'TICKET' | 'ASSIGNMENT' | 'ESCALATION' | 'SLA_WARNING' | 'MESSAGE' | 'AI_FAILURE' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface BillingPlan {
  id: 'free' | 'pro' | 'business' | 'enterprise';
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  limits: {
    aiConversations: number;
    voiceMinutes: number;
    tickets: number;
    knowledgeDocs: number;
    teamSeats: number;
  };
}
