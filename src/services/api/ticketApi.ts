import { apiClient } from './client';
import { Ticket, TicketStatus, TicketPriority } from '@/types';
import { mockTickets } from './mockData';

let ticketsStore = [...mockTickets];

export interface GetTicketsParams {
  status?: TicketStatus | 'ALL';
  priority?: TicketPriority | 'ALL';
  search?: string;
  assignedAgentId?: string;
  page?: number;
  limit?: number;
}

export const ticketApi = {
  async getTickets(params?: GetTicketsParams): Promise<{ tickets: Ticket[]; total: number }> {
    try {
      const { data } = await apiClient.get('/tickets', { params });
      return data;
    } catch {
      let filtered = [...ticketsStore];
      if (params?.status && params.status !== 'ALL') {
        filtered = filtered.filter((t) => t.status === params.status);
      }
      if (params?.priority && params.priority !== 'ALL') {
        filtered = filtered.filter((t) => t.priority === params.priority);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.subject.toLowerCase().includes(q) ||
            t.ticketNumber.toLowerCase().includes(q) ||
            t.customerName.toLowerCase().includes(q)
        );
      }
      if (params?.assignedAgentId) {
        filtered = filtered.filter((t) => t.assignedAgentId === params.assignedAgentId);
      }
      return {
        tickets: filtered,
        total: filtered.length,
      };
    }
  },

  async getTicketById(id: string): Promise<Ticket> {
    try {
      const { data } = await apiClient.get<Ticket>(`/tickets/${id}`);
      return data;
    } catch {
      const ticket = ticketsStore.find((t) => t.id === id || t.ticketNumber === id);
      if (!ticket) throw new Error('Ticket not found');
      return ticket;
    }
  },

  async updateTicketStatus(id: string, status: TicketStatus): Promise<Ticket> {
    try {
      const { data } = await apiClient.patch<Ticket>(`/tickets/${id}/status`, { status });
      return data;
    } catch {
      const index = ticketsStore.findIndex((t) => t.id === id);
      if (index !== -1) {
        ticketsStore[index] = {
          ...ticketsStore[index],
          status,
          updatedAt: new Date().toISOString(),
        };
        return ticketsStore[index];
      }
      throw new Error('Ticket not found');
    }
  },

  async assignTicket(id: string, agentId: string, agentName: string): Promise<Ticket> {
    try {
      const { data } = await apiClient.patch<Ticket>(`/tickets/${id}/assign`, { agentId, agentName });
      return data;
    } catch {
      const index = ticketsStore.findIndex((t) => t.id === id);
      if (index !== -1) {
        ticketsStore[index] = {
          ...ticketsStore[index],
          assignedAgentId: agentId,
          assignedAgentName: agentName,
          updatedAt: new Date().toISOString(),
        };
        return ticketsStore[index];
      }
      throw new Error('Ticket not found');
    }
  },

  async createTicket(ticket: Omit<Ticket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt'>): Promise<Ticket> {
    try {
      const { data } = await apiClient.post<Ticket>('/tickets', ticket);
      return data;
    } catch {
      const newTicket: Ticket = {
        ...ticket,
        id: `tkt-${Date.now()}`,
        ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      ticketsStore = [newTicket, ...ticketsStore];
      return newTicket;
    }
  },
};
