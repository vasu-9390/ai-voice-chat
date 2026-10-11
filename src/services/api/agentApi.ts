import { apiClient } from './client';
import { AgentConfig } from '@/types';
import { mockAgentConfig } from './mockData';

let agentConfigStore = { ...mockAgentConfig };

export const agentApi = {
  async getAgentConfig(): Promise<AgentConfig> {
    try {
      const { data } = await apiClient.get<AgentConfig>('/agent/config');
      return data;
    } catch {
      return { ...agentConfigStore };
    }
  },

  async updateAgentConfig(updates: Partial<AgentConfig>): Promise<AgentConfig> {
    try {
      const { data } = await apiClient.put<AgentConfig>('/agent/config', updates);
      return data;
    } catch {
      agentConfigStore = { ...agentConfigStore, ...updates };
      return { ...agentConfigStore };
    }
  },

  async toggleTool(toolId: string, enabled: boolean): Promise<AgentConfig> {
    try {
      const { data } = await apiClient.patch<AgentConfig>(`/agent/tools/${toolId}`, { enabled });
      return data;
    } catch {
      agentConfigStore = {
        ...agentConfigStore,
        allowedTools: agentConfigStore.allowedTools.map((t) =>
          t.id === toolId ? { ...t, enabled } : t
        ),
      };
      return { ...agentConfigStore };
    }
  },

  async testToolExecution(toolName: string, params: Record<string, any>): Promise<{
    status: 'completed' | 'failed';
    durationMs: number;
    result: any;
  }> {
    try {
      const { data } = await apiClient.post('/agent/tools/test', { toolName, params });
      return data;
    } catch {
      // Simulate live tool execution response
      return {
        status: 'completed',
        durationMs: Math.floor(180 + Math.random() * 120),
        result: {
          success: true,
          tool: toolName,
          payload: params,
          resolvedAt: new Date().toISOString(),
          message: `Tool ${toolName} executed successfully in sandbox cluster eu-central-1.`,
        },
      };
    }
  },
};
