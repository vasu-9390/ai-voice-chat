import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Mic,
  MicOff,
  Paperclip,
  Image as ImageIcon,
  RotateCcw,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ShieldAlert,
  TicketPlus,
  XCircle,
  FileText,
  Code2,
  Terminal,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { conversationApi } from '@/services/api/conversationApi';
import { ticketApi } from '@/services/api/ticketApi';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  codeSnippet?: string;
  timestamp: string;
  isStreaming?: boolean;
  feedback?: 'helpful' | 'not_helpful';
  attachments?: { name: string; size: string; type: 'image' | 'file' }[];
}

export const ChatAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello! I am **Aurora**, your 24/7 AI Customer Support Assistant for CogniVoice AI.
I can look up live shipments, verify warranty terms, process authorized refunds, or create support tickets with our engineering desk.

How can I help you today?`,
      timestamp: '14:30',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackState, setFeedbackState] = useState<Record<string, 'helpful' | 'not_helpful'>>({});
  const [escalated, setEscalated] = useState(false);
  const [ticketCreated, setTicketCreated] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const userText = textToSend || input;
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate token streaming response with markdown and code blocks
    setTimeout(() => {
      let fullText = '';
      let codeSnippet: string | undefined = undefined;

      if (userText.toLowerCase().includes('order') || userText.toLowerCase().includes('ship')) {
        fullText = `I have queried the live carrier database via \`getOrderStatus\`.
Your order **ORD-98214** (2x Enterprise Voice Gateways) passed through customs clearance at Chicago O'Hare and has been upgraded to FedEx Priority Overnight.`;
        codeSnippet = `// Live Carrier Webhook Payload
{
  "orderId": "ORD-98214",
  "carrier": "FedEx Priority",
  "eta": "Tomorrow 09:00 AM CST",
  "customsStatus": "CLEARED"
}`;
      } else if (userText.toLowerCase().includes('refund')) {
        fullText = `According to our Enterprise Master Agreement, your order qualifies for a 100% full hardware refund.
I can generate a prepaid FedEx return label and initiate a direct credit to your billing account.`;
      } else {
        fullText = `Thank you for contacting CogniVoice AI. I have reviewed your account telemetry and system configurations.
Here is the recommended command to verify your regional WebSocket latency:`;
        codeSnippet = `curl -X POST https://api.cognivoice.ai/v1/ping \\
  -H "Authorization: Bearer \${COGNIVOICE_TOKEN}"`;
      }

      const aiMsgId = `ai-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: 'ai',
          text: fullText,
          codeSnippet,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      // Simulate speech input
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput('Where is my shipment ORD-98214 currently located?');
      }, 1500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const handleRegenerate = (id: string) => {
    handleSend('Can you provide an alternative breakdown with full policy details?');
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, type: 'helpful' | 'not_helpful') => {
    setFeedbackState((prev) => ({ ...prev, [id]: type }));
  };

  const handleEscalate = () => {
    setEscalated(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        sender: 'ai',
        text: `⚡ **Session Escalated:** Connecting you directly with Devon Miles (Tier 1 Support Lead). Devon has been handed your complete chat history and order details.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleCreateTicket = async () => {
    const t = await ticketApi.createTicket({
      subject: 'Customer Chat Inquiry - Assistance Request',
      customerName: 'Olivia Sterling',
      customerEmail: 'olivia@clientcorp.io',
      category: 'Technical Support',
      priority: 'HIGH',
      status: 'OPEN',
      aiConfidence: 96,
      sentiment: 'Neutral',
      slaDeadline: new Date(Date.now() + 2 * 3600000).toISOString(),
      aiSummary: 'Customer initiated support inquiry from interactive chat assistant.',
      customerIntent: 'Inquiry',
      priorityReason: 'Automated ticket creation from chat session.',
      suggestedResponse: 'Support engineer review assigned.',
      recommendedAction: 'Review diagnostic logs and reply.',
      tags: ['Chat Assistant', 'Auto-Created'],
    });
    setTicketCreated(t.ticketNumber);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              Aurora AI Customer Assistant
              <Badge variant="purple" className="text-[10px]">Streaming Engine</Badge>
            </h2>
            <p className="text-xs text-slate-400">
              Omnichannel autonomous assistant with dynamic markdown & code execution
            </p>
          </div>
        </div>

        {/* Global Chat Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEscalate}
            disabled={escalated}
            leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
          >
            {escalated ? 'Escalated' : 'Escalate to Human'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleCreateTicket}
            disabled={!!ticketCreated}
            leftIcon={<TicketPlus className="w-3.5 h-3.5 text-indigo-400" />}
          >
            {ticketCreated ? `Ticket ${ticketCreated}` : 'Create Ticket'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessages([
                {
                  id: 'init-reset',
                  sender: 'ai',
                  text: 'Conversation ended. How else may I assist you with CogniVoice AI today?',
                  timestamp: 'Just now',
                },
              ]);
            }}
            leftIcon={<XCircle className="w-3.5 h-3.5 text-slate-400" />}
          >
            End Chat
          </Button>
        </div>
      </div>

      {/* Main Conversation Box */}
      <Card className="h-[520px] flex flex-col p-0 overflow-hidden bg-slate-900/60">
        {/* Messages stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${isAi ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isAi
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`max-w-xl flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                  <div
                    className={`rounded-2xl p-4 space-y-2 ${
                      isAi
                        ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Code Block rendering */}
                    {msg.codeSnippet && (
                      <div className="mt-2 rounded-lg bg-slate-950 border border-slate-800/80 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto">
                        <div className="flex items-center justify-between text-slate-500 pb-1 mb-1 border-b border-slate-800 text-[10px]">
                          <span className="flex items-center gap-1">
                            <Terminal className="w-3 h-3 text-indigo-400" /> payload
                          </span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                            className="hover:text-slate-300"
                          >
                            Copy
                          </button>
                        </div>
                        <pre>{msg.codeSnippet}</pre>
                      </div>
                    )}
                  </div>

                  {/* Actions & Feedback row for AI messages */}
                  {isAi && (
                    <div className="flex items-center gap-3 mt-1.5 px-1 text-slate-400 text-[11px]">
                      <span>{msg.timestamp}</span>

                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-slate-200 transition-colors flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>Copy</span>
                      </button>

                      <button
                        onClick={() => handleRegenerate(msg.id)}
                        className="hover:text-slate-200 transition-colors flex items-center gap-1"
                        title="Regenerate message"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Regenerate</span>
                      </button>

                      {/* Feedback Buttons */}
                      <div className="flex items-center gap-1 border-l border-slate-800 pl-2">
                        <button
                          onClick={() => handleFeedback(msg.id, 'helpful')}
                          className={`p-1 rounded hover:text-emerald-400 ${
                            feedbackState[msg.id] === 'helpful' ? 'text-emerald-400' : ''
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, 'not_helpful')}
                          className={`p-1 rounded hover:text-rose-400 ${
                            feedbackState[msg.id] === 'not_helpful' ? 'text-rose-400' : ''
                          }`}
                          title="Not Helpful"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1.5">
                <span>Aurora is formulating response</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer & Toolbar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* File & Image Upload button */}
            <label className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              <input type="file" className="hidden" onChange={(e) => {
                if (e.target.files?.[0]) {
                  setInput((prev) => `${prev} [Attached file: ${e.target.files![0].name}]`);
                }
              }} />
            </label>

            {/* Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isRecording ? 'Listening...' : 'Voice Input (Dictation)'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Main Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aurora anything about orders, policies, or technical integration..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />

            <Button type="submit" variant="glow" size="md">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
