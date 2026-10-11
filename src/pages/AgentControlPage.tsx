import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentApi } from '@/services/api/agentApi';
import { AgentConfig } from '@/types';
import {
  Sliders,
  Sparkles,
  Bot,
  Zap,
  Save,
  Check,
  ShieldAlert,
  Clock,
  Play,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Layers,
  Globe2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export const AgentControlPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['agent-config'],
    queryFn: () => agentApi.getAgentConfig(),
  });

  const [formState, setFormState] = useState<Partial<AgentConfig>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testTool, setTestTool] = useState('getOrderStatus');
  const [testParam, setTestParam] = useState('{"orderId": "ORD-98214"}');
  const [testOutput, setTestOutput] = useState<any>(null);
  const [isTestingTool, setIsTestingTool] = useState(false);

  // Sync state once data loads
  React.useEffect(() => {
    if (config) {
      setFormState(config);
    }
  }, [config]);

  const updateMutation = useMutation({
    mutationFn: (updates: Partial<AgentConfig>) => agentApi.updateAgentConfig(updates),
    onSuccess: (updated) => {
      queryClient.setQueryData(['agent-config'], updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    },
  });

  const handleToggleTool = (toolId: string, currentEnabled: boolean) => {
    if (!formState.allowedTools) return;
    const nextTools = formState.allowedTools.map((t) =>
      t.id === toolId ? { ...t, enabled: !currentEnabled } : t
    );
    setFormState({ ...formState, allowedTools: nextTools });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formState);
  };

  const handleRunToolTest = async () => {
    setIsTestingTool(true);
    let parsedParams = {};
    try {
      parsedParams = JSON.parse(testParam);
    } catch {
      parsedParams = { raw: testParam };
    }

    const res = await agentApi.testToolExecution(testTool, parsedParams);
    setTestOutput(res);
    setIsTestingTool(false);
  };

  if (isLoading || !config) {
    return <div className="p-8 text-center text-slate-400 text-xs">Loading AI Agent Control Panel...</div>;
  }

  const currentConfig = { ...config, ...formState };

  return (
    <div className="space-y-6">
      {/* Page Title & Save Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            AI Agent Control Panel
            <Badge variant="purple" className="text-xs">Orchestrator v2.4</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure system prompts, persona tone, allowed autonomous tools, and escalation triggers
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Config Saved
            </span>
          )}
          <Button
            variant="glow"
            size="md"
            onClick={handleSave}
            isLoading={updateMutation.isPending}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Personality, Instructions & Escalation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity & Personality Card */}
          <Card>
            <CardHeader>
              <CardTitle>Agent Identity & Personality Persona</CardTitle>
            </CardHeader>
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Agent Display Name"
                  value={currentConfig.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
                <Input
                  label="Avatar URL"
                  value={currentConfig.avatar}
                  onChange={(e) => setFormState({ ...formState, avatar: e.target.value })}
                />
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">Tone of Voice</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Professional', 'Empathetic', 'Concise', 'Friendly', 'Direct'] as const).map((tone) => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setFormState({ ...formState, tone })}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                        currentConfig.tone === tone
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creativity / Temperature Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-300">Creativity / Temperature</label>
                  <span className="font-mono text-indigo-400 font-semibold">{currentConfig.creativityLevel}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentConfig.creativityLevel}
                  onChange={(e) => setFormState({ ...formState, creativityLevel: Number(e.target.value) })}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Deterministic (0%)</span>
                  <span>Balanced (50%)</span>
                  <span>Creative (100%)</span>
                </div>
              </div>

              {/* System Instructions / Prompt */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Master System Prompt (Meta Instructions)
                </label>
                <textarea
                  rows={6}
                  value={currentConfig.systemInstructions}
                  onChange={(e) => setFormState({ ...formState, systemInstructions: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                />
              </div>
            </div>
          </Card>

          {/* Escalation Rules & Guardrails */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Escalation Rules & Confidence Guardrails
              </CardTitle>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
                <div>
                  <span className="font-semibold text-slate-200 block">Sentiment-Triggered Handoff</span>
                  <span className="text-[11px] text-slate-400">
                    Automatically escalate when customer sentiment drops below 40% (Frustrated / Angry).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.escalationRules?.escalateOnSentiment ?? true}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      escalationRules: {
                        ...currentConfig.escalationRules,
                        escalateOnSentiment: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer hover:bg-slate-950">
                <div>
                  <span className="font-semibold text-slate-200 block">Negative Keyword Intercept</span>
                  <span className="text-[11px] text-slate-400">
                    Immediately flag session on keywords like "lawyer", "manager", "dispute", "cancel contract".
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={currentConfig.escalationRules?.escalateOnNegativeKeywords ?? true}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      escalationRules: {
                        ...currentConfig.escalationRules,
                        escalateOnNegativeKeywords: e.target.checked,
                      },
                    })
                  }
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600"
                />
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Input
                  label="Confidence Threshold (%)"
                  type="number"
                  value={currentConfig.escalationRules?.confidenceThreshold ?? 85}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      escalationRules: {
                        ...currentConfig.escalationRules,
                        confidenceThreshold: Number(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  label="Max AI Attempts Before Transfer"
                  type="number"
                  value={currentConfig.escalationRules?.maxAiAttemptsBeforeEscalate ?? 3}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      escalationRules: {
                        ...currentConfig.escalationRules,
                        maxAiAttemptsBeforeEscalate: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Allowed Autonomous Tools & Live Tool Execution Tester */}
        <div className="lg:col-span-5 space-y-6">
          {/* Allowed Tools Matrix */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" /> Allowed Autonomous Tools
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Toggle live capabilities authorized for execution</p>
              </div>
            </CardHeader>
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {currentConfig.allowedTools?.map((tool) => (
                <div
                  key={tool.id}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-300">{tool.name}</span>
                      <Badge variant={tool.enabled ? 'success' : 'outline'} className="text-[9px]">
                        {tool.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{tool.description}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={tool.enabled}
                    onChange={() => handleToggleTool(tool.id, tool.enabled)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-indigo-600 mt-1 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Interactive Live Tool Sandbox Tester */}
          <Card>
            <CardHeader>
              <div>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Tool Sandbox Tester
                </CardTitle>
                <p className="text-xs text-slate-400 mt-0.5">Test real tool execution payloads before deploying</p>
              </div>
            </CardHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Tool</label>
                <select
                  value={testTool}
                  onChange={(e) => setTestTool(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200"
                >
                  {currentConfig.allowedTools?.map((t) => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Parameters (JSON)</label>
                <textarea
                  rows={3}
                  value={testParam}
                  onChange={(e) => setTestParam(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2 text-xs font-mono text-slate-300"
                />
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={handleRunToolTest}
                isLoading={isTestingTool}
                className="w-full"
                leftIcon={<Play className="w-3.5 h-3.5" />}
              >
                Execute Tool in Sandbox
              </Button>

              {/* Execution Output result */}
              {testOutput && (
                <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-emerald-500/30 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-emerald-400 mb-1.5 font-bold">
                    <span>✓ Tool {testTool} Execution: Completed</span>
                    <span className="text-slate-400">{testOutput.durationMs}ms</span>
                  </div>
                  <pre className="text-slate-300 overflow-x-auto p-1 bg-slate-900 rounded">
                    {JSON.stringify(testOutput.result, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
