import { apiClient } from './client';
import { Conversation, ChatMessage } from '@/types';
import { mockConversations, mockMessagesByConversation } from './mockData';

let convsStore = [...mockConversations];
const messagesStore: Record<string, ChatMessage[]> = { ...mockMessagesByConversation };

export const conversationApi = {
  async getConversations(statusFilter?: string): Promise<Conversation[]> {
    try {
      const { data } = await apiClient.get<Conversation[]>('/conversations', {
        params: { status: statusFilter },
      });
      return data;
    } catch {
      if (!statusFilter || statusFilter === 'all') return [...convsStore];
      if (statusFilter === 'assigned_to_me') {
        return convsStore.filter((c) => c.assignedAgent === 'Devon Miles');
      }
      return convsStore.filter((c) => c.status === statusFilter);
    }
  },

  async getConversationById(id: string): Promise<Conversation> {
    try {
      const { data } = await apiClient.get<Conversation>(`/conversations/${id}`);
      return data;
    } catch {
      const conv = convsStore.find((c) => c.id === id);
      if (!conv) throw new Error('Conversation not found');
      return conv;
    }
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const { data } = await apiClient.get<ChatMessage[]>(`/conversations/${conversationId}/messages`);
      return data;
    } catch {
      return messagesStore[conversationId] || [];
    }
  },

  async sendMessage(
    conversationId: string,
    payload: {
      content: string;
      senderType?: 'customer' | 'agent';
      senderName?: string;
      senderAvatar?: string;
      attachments?: { name: string; url: string; size: string; type: 'image' | 'file' | 'audio' }[];
    }
  ): Promise<ChatMessage> {
    try {
      const { data } = await apiClient.post<ChatMessage>(`/conversations/${conversationId}/messages`, payload);
      return data;
    } catch {
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderType: payload.senderType || 'agent',
        senderName: payload.senderName || 'Devon Miles',
        senderAvatar: payload.senderAvatar,
        content: payload.content,
        timestamp: new Date().toISOString(),
        status: 'delivered',
        attachments: payload.attachments,
      };

      if (!messagesStore[conversationId]) {
        messagesStore[conversationId] = [];
      }
      messagesStore[conversationId].push(newMsg);

      // update last message in conversation
      const cIdx = convsStore.findIndex((c) => c.id === conversationId);
      if (cIdx !== -1) {
        convsStore[cIdx] = {
          ...convsStore[cIdx],
          lastMessage: payload.content,
          lastMessageTimestamp: newMsg.timestamp,
        };
      }

      return newMsg;
    }
  },

  async triggerAiResponse(
    conversationId: string,
    customerPrompt: string
  ): Promise<ChatMessage> {
    try {
      const { data } = await apiClient.post<ChatMessage>(`/conversations/${conversationId}/ai-generate`, {
        prompt: customerPrompt,
      });
      return data;
    } catch {
      // Realistic autonomous AI simulation with tool calling
      const isOrderRelated = customerPrompt.toLowerCase().includes('order') || customerPrompt.toLowerCase().includes('track') || customerPrompt.toLowerCase().includes('ship');
      const isRefundRelated = customerPrompt.toLowerCase().includes('refund') || customerPrompt.toLowerCase().includes('return') || customerPrompt.toLowerCase().includes('money');

      const toolsUsed = [];
      let replyContent = '';

      if (isOrderRelated) {
        toolsUsed.push({
          toolName: 'getOrderStatus',
          status: 'completed' as const,
          timestamp: new Date().toISOString(),
          input: { query: customerPrompt, confidenceCheck: true },
          output: { trackingStatus: 'In Transit', carrier: 'FedEx Freight', location: 'Chicago Logistics Node' },
        });
        replyContent = `I looked into your shipment status using our carrier telemetry tool. Order **#ORD-98214** is currently in transit at the Chicago Logistics hub. Customs verification has completed and delivery dispatch is slated for tomorrow morning at 9:00 AM.`;
      } else if (isRefundRelated) {
        toolsUsed.push({
          toolName: 'checkRefundPolicy',
          status: 'completed' as const,
          timestamp: new Date().toISOString(),
          input: { returnWindowDays: 30, verifiedPurchase: true },
          output: { eligible: true, maxRefundable: '$1,250.00', warrantyCovered: true },
        });
        replyContent = `I have verified your account and purchase eligibility against our enterprise refund policy. Your return is fully covered under the 30-day hardware guarantee. I can immediately generate a prepaid return label and authorize an expedited refund to your original payment method. Would you like me to process this now?`;
      } else {
        toolsUsed.push({
          toolName: 'searchCustomer',
          status: 'completed' as const,
          timestamp: new Date().toISOString(),
          input: { query: 'customerContext' },
          output: { tier: 'Enterprise VIP', slaTarget: '15m' },
        });
        replyContent = `Thank you for reaching out! Based on your Enterprise profile, I have verified your system configuration. How can I best assist your team with this today?`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderType: 'ai',
        senderName: 'CogniVoice Agent (Aurora)',
        senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
        content: replyContent,
        timestamp: new Date().toISOString(),
        toolExecutions: toolsUsed,
        status: 'read',
      };

      if (!messagesStore[conversationId]) {
        messagesStore[conversationId] = [];
      }
      messagesStore[conversationId].push(aiMsg);
      return aiMsg;
    }
  },

  async escalate(conversationId: string, reason?: string): Promise<Conversation> {
    try {
      const { data } = await apiClient.post<Conversation>(`/conversations/${conversationId}/escalate`, { reason });
      return data;
    } catch {
      const cIdx = convsStore.findIndex((c) => c.id === conversationId);
      if (cIdx !== -1) {
        convsStore[cIdx] = {
          ...convsStore[cIdx],
          status: 'escalated',
          priority: 'URGENT',
        };
        const sysMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          conversationId,
          senderType: 'system',
          senderName: 'System',
          content: `⚡ Conversation escalated to senior human tier. Reason: ${reason || 'Customer requested human intervention.'}`,
          timestamp: new Date().toISOString(),
        };
        if (!messagesStore[conversationId]) messagesStore[conversationId] = [];
        messagesStore[conversationId].push(sysMsg);
        return convsStore[cIdx];
      }
      throw new Error('Conversation not found');
    }
  },

  async updateFeedback(messageId: string, feedback: 'helpful' | 'not_helpful'): Promise<void> {
    try {
      await apiClient.post(`/messages/${messageId}/feedback`, { feedback });
    } catch {
      // Update in memory
      for (const convId in messagesStore) {
        const msg = messagesStore[convId].find((m) => m.id === messageId);
        if (msg) {
          msg.feedback = feedback;
          break;
        }
      }
    }
  },
};
