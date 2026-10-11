import React, { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import {
  User,
  Building,
  Users,
  Shield,
  Bot,
  BookOpen,
  Radio,
  Mic,
  Bell,
  Lock,
  CreditCard,
  Key,
  Webhook,
  Save,
  Check,
  Plus,
  Trash2,
  Copy,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'Production Backend Server', prefix: 'cg_live_9f82...3b1a', created: '2026-09-12' },
    { id: 'key-2', name: 'Staging Webhook Dispatcher', prefix: 'cg_test_7a11...90fe', created: '2026-10-01' },
  ]);

  // Webhooks state
  const [webhooks, setWebhooks] = useState([
    { id: 'wh-1', url: 'https://api.acmecorp.com/webhooks/cognivoice', events: 'ticket.created, ticket.escalated', status: 'Healthy' },
  ]);
  const [webhookUrlInput, setWebhookUrlInput] = useState('');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'org', label: 'Organization', icon: Building },
    { id: 'team', label: 'Team & Roles', icon: Users },
    { id: 'channels', label: 'Channels', icon: Radio },
    { id: 'voice', label: 'Voice Config', icon: Mic },
    { id: 'security', label: 'Security & 2FA', icon: Lock },
    { id: 'apikeys', label: 'API Keys', icon: Key },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateApiKey = () => {
    const newKey = {
      id: `key-${Date.now()}`,
      name: `Generated Key #${apiKeys.length + 1}`,
      prefix: `cg_live_${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`,
      created: 'Just now',
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const handleAddWebhook = () => {
    if (!webhookUrlInput) return;
    setWebhooks([
      ...webhooks,
      { id: `wh-${Date.now()}`, url: webhookUrlInput, events: 'all_events', status: 'Active' },
    ]);
    setWebhookUrlInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Platform Settings & Integrations
            <Badge variant="purple" className="text-xs">Enterprise Security</Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization credentials, API tokens, webhook endpoints, and channels
          </p>
        </div>

        {savedSuccess && (
          <span className="text-emerald-400 text-xs font-medium flex items-center gap-1 animate-in fade-in">
            <Check className="w-4 h-4" /> Preferences Updated
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Vertical Navigation Tabs */}
        <div className="md:col-span-3 space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors text-left ${
                activeTab === t.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <t.icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Right Settings Content Area */}
        <div className="md:col-span-9 space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Profile & Identity</CardTitle>
              </CardHeader>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="flex items-center gap-4 pb-2">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                    alt="User"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/40"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-white">{user?.name}</h4>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                    <Badge variant="purple" className="mt-1 text-[10px]">{user?.role}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Full Name" defaultValue={user?.name || ''} />
                  <Input label="Work Email" defaultValue={user?.email || ''} />
                </div>
                <Input label="Department" defaultValue={user?.department || 'Support Desk'} />

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    Save Profile
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* ORGANIZATION TAB */}
          {activeTab === 'org' && (
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
              </CardHeader>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Company Name" defaultValue="Acme Technologies Global" />
                  <Input label="Organization ID" defaultValue="org_98a72b109c" disabled />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Primary Support Domain" defaultValue="support.acmecorp.com" />
                  <Input label="SLA Region" defaultValue="eu-central-1 (Frankfurt)" />
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm">Save Organization</Button>
                </div>
              </form>
            </Card>
          )}

          {/* TEAM & ROLES TAB */}
          {activeTab === 'team' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <CardTitle>Team Members & RBAC Roles</CardTitle>
                  <Button variant="outline" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Invite Member
                  </Button>
                </div>
              </CardHeader>
              <div className="divide-y divide-slate-800 text-xs">
                {[
                  { name: 'Elena Rostova', email: 'elena@cognivoice.ai', role: 'SUPER_ADMIN', status: 'Active' },
                  { name: 'Marcus Vance', email: 'marcus.v@acmecorp.com', role: 'ORG_ADMIN', status: 'Active' },
                  { name: 'Sarah Chen', email: 'sarah.c@acmecorp.com', role: 'TEAM_MANAGER', status: 'Active' },
                  { name: 'Devon Miles', email: 'devon.m@acmecorp.com', role: 'SUPPORT_AGENT', status: 'Active' },
                ].map((m, i) => (
                  <div key={i} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-200">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="purple" className="text-[10px]">{m.role.replace('_', ' ')}</Badge>
                      <Badge variant="success" className="text-[9px]">{m.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CHANNELS TAB */}
          {activeTab === 'channels' && (
            <Card>
              <CardHeader>
                <CardTitle>Omnichannel Integrations</CardTitle>
              </CardHeader>
              <div className="space-y-3 text-xs">
                {[
                  { name: 'Web Chat Embed', desc: 'Floating widget snippet for customer-facing web applications', status: 'Connected' },
                  { name: 'Inbound Telephony (Voice)', desc: 'Dedicated SIP Trunk & WebRTC Opus numbers', status: 'Connected' },
                  { name: 'Email Forwarding Desk', desc: 'support@acmecorp.com parsed via IMAP/SES', status: 'Connected' },
                  { name: 'WhatsApp Business API', desc: 'Direct message automation via Meta Business Cloud', status: 'Pending Setup' },
                  { name: 'Slack Connect', desc: 'Shared customer channels with internal escalation alerts', status: 'Connected' },
                ].map((ch, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block">{ch.name}</span>
                      <span className="text-[11px] text-slate-400">{ch.desc}</span>
                    </div>
                    <Badge variant={ch.status === 'Connected' ? 'success' : 'outline'} className="text-[10px]">
                      {ch.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* VOICE CONFIG TAB */}
          {activeTab === 'voice' && (
            <Card>
              <CardHeader>
                <CardTitle>Voice AI Synthesis & Audio Model Options</CardTitle>
              </CardHeader>
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Voice Model Actor</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200">
                    <option>Aurora (Female, Natural Warm, US Accent)</option>
                    <option>Echo (Male, Professional Direct, UK Accent)</option>
                    <option>Sol (Neutral, Clear Tech Specialist)</option>
                    <option>Nova (Expressive, Customer Service)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Audio Bitrate (WebRTC)" defaultValue="128 kbps Opus" />
                  <Input label="Voice Activity Detection (VAD) Sensitivity" defaultValue="High (180ms delay)" />
                </div>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer pt-1">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-indigo-600" />
                  <span>Enable real-time background noise cancellation (RNNoise)</span>
                </label>

                <div className="flex justify-end pt-2">
                  <Button type="submit" variant="primary" size="sm">Save Voice Config</Button>
                </div>
              </form>
            </Card>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security, 2FA & Session Governance</CardTitle>
              </CardHeader>
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-200">Two-Factor Authentication (2FA)</h5>
                    <p className="text-[11px] text-slate-400">Enforce TOTP authenticator app across all organization agents</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-200">Single Sign-On (SAML / Okta)</h5>
                    <p className="text-[11px] text-slate-400">Enterprise identity provider federation</p>
                  </div>
                  <Button variant="outline" size="sm">Configure SSO</Button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-slate-200">Revoke Active Web Sessions</h5>
                    <p className="text-[11px] text-slate-400">Sign out all existing browser sessions across other devices</p>
                  </div>
                  <Button variant="danger" size="sm">Log Out All Devices</Button>
                </div>
              </div>
            </Card>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'apikeys' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Enterprise API Keys</CardTitle>
                    <p className="text-xs text-slate-400 mt-0.5">Authenticate REST & WebSocket calls safely</p>
                  </div>
                  <Button variant="primary" size="sm" onClick={handleCreateApiKey} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Generate Key
                  </Button>
                </div>
              </CardHeader>
              <div className="space-y-3 text-xs">
                {apiKeys.map((k) => (
                  <div key={k.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-200 block">{k.name}</span>
                      <span className="font-mono text-slate-400 text-[11px]">{k.prefix}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(k.prefix)}
                        leftIcon={<Copy className="w-3.5 h-3.5" />}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setApiKeys(apiKeys.filter((x) => x.id !== k.id))}
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* WEBHOOKS TAB */}
          {activeTab === 'webhooks' && (
            <Card>
              <CardHeader>
                <CardTitle>Webhook Endpoints & Real-time Event Relays</CardTitle>
              </CardHeader>
              <div className="space-y-4 text-xs">
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={webhookUrlInput}
                    onChange={(e) => setWebhookUrlInput(e.target.value)}
                    placeholder="https://api.yourdomain.com/webhooks/cognivoice"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200"
                  />
                  <Button variant="primary" size="sm" onClick={handleAddWebhook}>
                    Add Webhook
                  </Button>
                </div>

                <div className="space-y-2">
                  {webhooks.map((wh) => (
                    <div key={wh.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="truncate pr-4">
                        <span className="font-mono text-indigo-400 font-semibold block truncate">{wh.url}</span>
                        <span className="text-[10px] text-slate-500">Events: {wh.events}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="success" className="text-[9px]">{wh.status}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setWebhooks(webhooks.filter((x) => x.id !== wh.id))}
                          className="text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
