import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Bot,
  Mic,
  Headphones,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Play,
  Check,
  Star,
  ChevronDown,
  Globe2,
  Users,
  Layers,
  PhoneCall,
  Volume2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { billingPlans } from '@/services/api/billingApi';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [demoVoiceActive, setDemoVoiceActive] = useState(false);
  const [demoChatMessages, setDemoChatMessages] = useState([
    {
      sender: 'customer',
      text: 'Hi, I need to know why my order ORD-98214 is delayed at Chicago hub.',
      time: '14:22',
    },
    {
      sender: 'ai',
      text: 'Checking live carrier telemetry for Order #ORD-98214...',
      tool: '✓ Called getOrderStatus: Chicago Hub customs cleared',
      time: '14:22',
    },
    {
      sender: 'ai',
      text: 'Good news! The customs hold just cleared. Your 2x Enterprise Gateways will be out for delivery tomorrow at 9:00 AM via FedEx Priority Overnight at zero surcharge.',
      time: '14:23',
    },
  ]);
  const [demoInput, setDemoInput] = useState('');

  const handleSendDemoMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoInput.trim()) return;

    const userText = demoInput;
    setDemoInput('');
    setDemoChatMessages((prev) => [
      ...prev,
      { sender: 'customer', text: userText, time: 'Just now' },
    ]);

    setTimeout(() => {
      setDemoChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I've analyzed your query with CogniVoice RAG knowledge base. Our automated agent has verified your enterprise credentials and confirmed the optimal resolution path.`,
          tool: '✓ Tool Executed: searchKnowledgeBase & customerContextLookup',
          time: 'Just now',
        },
      ]);
    }, 900);
  };

  const faqs = [
    {
      q: 'How does CogniVoice Voice AI achieve sub-500ms latency?',
      a: 'We stream raw Opus audio over duplex WebSockets and WebRTC directly to low-latency edge nodes. Voice Activity Detection (VAD) coupled with streaming speculative token execution begins generating spoken audio before the LLM finishes drafting its full paragraph.',
    },
    {
      q: 'Can the AI Agent execute real actions like refunds and CRM updates?',
      a: 'Yes. Through secure tool sandboxes, CogniVoice integrates with Stripe, Zendesk, Salesforce, Shopify, and custom REST APIs. Every action is monitored by guardrails, confidence scoring, and configurable human escalation thresholds.',
    },
    {
      q: 'What happens when a customer becomes angry or wants a human?',
      a: 'CogniVoice performs continuous sentiment tracking. If a customer displays frustration or explicit keywords, the session seamlessly transfers to a human support agent with full AI summary, intent notes, and copilot suggested responses.',
    },
    {
      q: 'Is CogniVoice enterprise compliant (SOC 2, HIPAA, GDPR)?',
      a: 'Yes. CogniVoice offers enterprise VPC deployments, data zero-retention policies, PII token masking, and end-to-end encryption across all voice and chat channels.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
              CogniVoice <Badge variant="purple" className="text-[10px]">AI</Badge>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#demo" className="hover:text-white transition-colors">Interactive Demo</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#voice" className="hover:text-white transition-colors">Voice AI</a>
            <a href="#analytics" className="hover:text-white transition-colors">Analytics</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[350px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Next-Generation Omnichannel Voice & Support Agents
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            AI Customer Support <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              That Works 24/7
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Automate customer conversations, resolve tickets faster, and let AI agents handle repetitive support operations across chat, email, and ultra-low-latency voice.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="glow"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Free Trial
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/app/voice')}
              leftIcon={<Mic className="w-4 h-4 text-purple-400" />}
            >
              Try Voice AI Agent
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/app/dashboard')}
            >
              Live Enterprise Portal
            </Button>
          </div>

          {/* Social Proof metrics */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">76.4%</p>
              <p className="text-xs text-slate-400 mt-1">Autonomous Resolution</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">&lt; 420ms</p>
              <p className="text-xs text-slate-400 mt-1">Duplex Voice Latency</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">94.2%</p>
              <p className="text-xs text-slate-400 mt-1">Customer CSAT Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white tracking-tight">10M+</p>
              <p className="text-xs text-slate-400 mt-1">Conversations Handled</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Support & Voice Demonstration Section */}
      <section id="demo" className="py-16 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="purple" className="mb-3">Live Interactive Demonstration</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Experience the Autonomous AI Support Engine
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
              Test both our intelligent text agent with real tool executions and our ultra-low-latency voice agent in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Interactive Chat Agent Demo */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px]">
              <div className="bg-slate-950/80 p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150"
                      alt="Aurora AI"
                      className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/40"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                      Aurora AI Copilot <Badge variant="success" className="text-[9px]">Tool Capable</Badge>
                    </h4>
                    <p className="text-[10px] text-slate-400">Order #ORD-98214 & Logistics Context</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">Text Channel</Badge>
              </div>

              {/* Chat Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/60">
                {demoChatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs ${
                        msg.sender === 'customer'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                      }`}
                    >
                      {msg.tool && (
                        <div className="mb-2 p-1.5 rounded-md bg-indigo-950/60 border border-indigo-500/30 text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                          <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span>{msg.tool}</span>
                        </div>
                      )}
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input box */}
              <form onSubmit={handleSendDemoMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={demoInput}
                  onChange={(e) => setDemoInput(e.target.value)}
                  placeholder="Type a test message (e.g. 'Can I get a refund?')..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <Button type="submit" variant="primary" size="sm">
                  Send
                </Button>
              </form>
            </div>

            {/* Interactive Voice AI Demonstration */}
            <div id="voice" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[520px] p-6 text-center justify-between relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-slate-200">Neural Voice Synthesizer</span>
                </div>
                <Badge variant={demoVoiceActive ? 'success' : 'default'} dot={demoVoiceActive}>
                  {demoVoiceActive ? 'AI Speaking (Duplex)' : 'Standby'}
                </Badge>
              </div>

              {/* Voice Central Visualizer */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  {demoVoiceActive && (
                    <>
                      <div className="absolute inset-0 rounded-full bg-indigo-500/30 animate-ping" />
                      <div className="absolute -inset-4 rounded-full bg-purple-500/20 animate-pulse" />
                    </>
                  )}
                  <button
                    onClick={() => setDemoVoiceActive(!demoVoiceActive)}
                    className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                      demoVoiceActive
                        ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white scale-105 shadow-indigo-500/50'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <Mic className="w-10 h-10" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-white">
                  {demoVoiceActive ? 'Voice Stream Active' : 'Click Microphone to Test Voice AI'}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {demoVoiceActive
                    ? 'AI: "Hello! I am actively streaming duplex audio over WebSocket. How can I assist you with your order today?"'
                    : 'Experience human-like voice synthesis with sub-500ms latency and zero awkward robotic pauses.'}
                </p>

                {/* Animated Waveform Bars */}
                <div className="flex items-center justify-center gap-1.5 h-12 mt-6">
                  {Array.from({ length: 16 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-1 rounded-full bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-200 ${
                        demoVoiceActive ? 'sound-bar' : 'h-2 bg-slate-700'
                      }`}
                      style={{
                        animationDelay: `${idx * 0.08}s`,
                        height: demoVoiceActive ? `${Math.sin(idx) * 20 + 24}px` : '6px',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Regional Node: eu-central-1 (118ms)</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/app/voice')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Open Full Voice Studio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-3">Enterprise Architecture</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Engineered for Modern Customer Experience
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
              Everything your support team needs to reduce ticket queues by 70%+ while improving customer satisfaction scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Mic,
                title: 'Real-Time Voice AI Agent',
                desc: 'Duplex WebRTC voice calls with Web Audio API synthesis, dynamic interruptions, and sub-second response times.',
              },
              {
                icon: Zap,
                title: 'Autonomous Tool Sandboxes',
                desc: 'Let AI securely invoke API tools: order lookups, warranty validation, instant refunds, and ticket creation.',
              },
              {
                icon: BookOpen,
                title: 'Vector RAG Knowledge Base',
                desc: 'Upload PDFs, Word docs, Markdown, and TXT files. Automatic chunking and high-dimensional semantic search.',
              },
              {
                icon: Headphones,
                title: 'AI Copilot for Support Agents',
                desc: 'Empower human agents with instant suggested responses, customer sentiment analysis, and 1-click approvals.',
              },
              {
                icon: Shield,
                title: 'Intelligent Escalation Guardrails',
                desc: 'Continuous sentiment tracking and confidence thresholds trigger seamless handoffs to human specialists.',
              },
              {
                icon: BarChart3,
                title: 'Executive Real-Time Analytics',
                desc: 'Track AI resolution rates, CSAT trends, SLA countdown warnings, and individual agent performance metrics.',
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-900/30 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="purple" className="mb-3">Transparent Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Scalable Plans for Teams of All Sizes
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Start with our free developer tier and upgrade seamlessly as your support volume grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {billingPlans.map((plan) => {
              const isBusiness = plan.id === 'business';
              return (
                <div
                  key={plan.id}
                  className={`p-6 rounded-2xl flex flex-col justify-between transition-all ${
                    isBusiness
                      ? 'bg-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/10 relative'
                      : 'bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  {isBusiness && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 min-h-[36px]">{plan.description}</p>
                    <div className="mt-4 mb-6">
                      <span className="text-3xl font-extrabold text-white">${plan.monthlyPrice}</span>
                      <span className="text-xs text-slate-400"> / month</span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-slate-300 pb-6 border-b border-slate-800">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant={isBusiness ? 'glow' : 'outline'}
                      size="sm"
                      onClick={() => navigate('/register')}
                      className="w-full"
                    >
                      {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400 mt-2">Everything you need to know about CogniVoice AI</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-100 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      activeFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-indigo-950/40 to-slate-950 border-t border-slate-800/80 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Automate Customer Support with Voice AI?
          </h2>
          <p className="mt-4 text-sm text-slate-400 max-w-xl mx-auto">
            Deploy your first AI agent in under 10 minutes. Reduce resolution times, eliminate ticket backlogs, and delight customers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant="glow"
              size="lg"
              onClick={() => navigate('/register')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Start Free Trial Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/app/dashboard')}
            >
              View Live Demo Dashboard
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-12 px-4 sm:px-6 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-white">CogniVoice AI Inc.</span>
            <span>© 2026. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Security & SOC 2</a>
            <a href="#" className="hover:text-slate-300">Status Page</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
