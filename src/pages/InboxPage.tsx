import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { conversationApi } from '@/services/api/conversationApi';
import { Conversation, ChatMessage, ToolExecutionEvent } from '@/types';
import {
  Inbox as InboxIcon,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  Paperclip,
  Image as ImageIcon,
  Bot,
  User,
  ArrowUpRight,
  ShieldAlert,
  Zap,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  CornerDownRight,
  ShoppingBag,
  Ticket as TicketIcon,
  Phone,
  Mail,
  Building,
  Tag,
  DollarSign,
  Heart,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatTimeAgo, formatCurrency, cn, getPriorityColor } from '@/utils';
import { socketService } from '@/services/websocket/socketService';

export const InboxPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState('');
  const [isCopilotSuggesting, setIsCopilotSuggesting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Conversations
  const { data: conversations = [], isLoading: loadingConvs } = useQuery({
    queryKey: ['conversations', activeFilter],
    queryFn: () => conversationApi.getConversations(activeFilter),
  });

  // Selected Conversation details
  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Fetch Messages for current conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['messages', selectedConv?.id],
    queryFn: () => (selectedConv ? conversationApi.getMessages(selectedConv.id) : []),
    enabled: !!selectedConv,
  });

  // Socket listener for real-time messages & typing
  useEffect(() => {
    const unsubNewMsg = socketService.on('message:new', (newMsg: ChatMessage) => {
      if (newMsg.conversationId === selectedConv?.id) {
        queryClient.setQueryData(['messages', selectedConv?.id], (old: ChatMessage[] = []) => [
          ...old,
          newMsg,
        ]);
      }
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return () => {
      unsubNewMsg();
    };
  }, [selectedConv?.id, queryClient]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (text: string) =>
      conversationApi.sendMessage(selectedConv.id, {
        content: text,
        senderType: 'agent',
        senderName: 'Devon Miles',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      }),
    onSuccess: (newMsg) => {
      queryClient.setQueryData(['messages', selectedConv.id], (old: ChatMessage[] = []) => [
        ...old,
        newMsg,
      ]);
      setInputText('');
    },
  });

  // Escalate mutation
  const escalateMutation = useMutation({
    mutationFn: () => conversationApi.escalate(selectedConv.id, 'Agent requested Tier 2 intervention.'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConv.id] });
    },
  });

  // AI Response trigger
  const aiTriggerMutation = useMutation({
    mutationFn: (prompt: string) => conversationApi.triggerAiResponse(selectedConv.id, prompt),
    onSuccess: (newMsg) => {
      queryClient.setQueryData(['messages', selectedConv.id], (old: ChatMessage[] = []) => [
        ...old,
        newMsg,
      ]);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMutation.mutate(inputText);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filterTabs = [
    { id: 'all', label: 'All Conversations' },
    { id: 'unassigned', label: 'Unassigned' },
    { id: 'assigned_to_me', label: 'Assigned to Me' },
    { id: 'ai_handled', label: 'AI Handled' },
    { id: 'human_handled', label: 'Human Handled' },
    { id: 'escalated', label: 'Escalated' },
    { id: 'waiting', label: 'Waiting' },
    { id: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col -m-4 sm:-m-6 lg:-m-8 bg-slate-950 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANE: Conversation Filter Lists */}
        <div className="w-80 border-r border-slate-800/80 bg-slate-900/50 flex flex-col shrink-0">
          {/* Header & Filter Search */}
          <div className="p-3 border-b border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <InboxIcon className="w-4 h-4 text-indigo-400" /> Support Inbox
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {conversations.length} total
              </span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Filter inbox..."
                className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Categorized Filter Tabs */}
          <div className="p-2 border-b border-slate-800/80 overflow-x-auto flex gap-1 scrollbar-none text-[11px]">
            {filterTabs.slice(0, 4).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  'px-2 py-1 rounded whitespace-nowrap font-medium transition-colors',
                  activeFilter === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {conversations.map((conv) => {
              const isSelected = selectedConv?.id === conv.id;
              const pColor = getPriorityColor(conv.priority);

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    'p-3 hover:bg-slate-800/50 cursor-pointer transition-all flex flex-col gap-1.5 text-left border-l-2',
                    isSelected
                      ? 'bg-slate-800/70 border-l-indigo-500'
                      : 'border-l-transparent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={conv.customer.avatar}
                        alt={conv.customer.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <span className="text-xs font-semibold text-slate-200 truncate">
                        {conv.customer.name}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      {formatTimeAgo(conv.lastMessageTimestamp)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-1">
                    {conv.lastMessage}
                  </p>

                  <div className="flex items-center justify-between text-[10px] pt-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('px-1.5 py-0.2 rounded font-medium border', pColor.bg)}>
                        {conv.priority}
                      </span>
                      <span className="text-slate-500 uppercase">{conv.channel}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {conv.status === 'ai_handled' && (
                        <span className="flex items-center gap-0.5 text-purple-400">
                          <Bot className="w-3 h-3" /> AI
                        </span>
                      )}
                      {conv.status === 'escalated' && (
                        <span className="flex items-center gap-0.5 text-rose-400 font-bold">
                          <AlertCircle className="w-3 h-3" /> Escalated
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER PANE: Conversation Chat Thread */}
        <div className="flex-1 flex flex-col bg-slate-950 min-w-0">
          {/* Header */}
          {selectedConv && (
            <div className="p-3 px-5 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConv.customer.avatar}
                  alt={selectedConv.customer.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{selectedConv.customer.name}</h3>
                    <Badge variant="purple" className="text-[10px]">
                      {selectedConv.customer.company}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>Channel: <strong className="text-slate-300 uppercase">{selectedConv.channel}</strong></span>
                    <span>•</span>
                    <span>Status: <strong className="text-indigo-400">{selectedConv.status.replace('_', ' ')}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => escalateMutation.mutate()}
                  isLoading={escalateMutation.isPending}
                  leftIcon={<ShieldAlert className="w-3.5 h-3.5 text-rose-400" />}
                >
                  Escalate
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    aiTriggerMutation.mutate('Please check the latest carrier telemetry and provide status.')
                  }
                  isLoading={aiTriggerMutation.isPending}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Ask Aurora Copilot
                </Button>
              </div>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => {
              const isCustomer = msg.senderType === 'customer';
              const isAi = msg.senderType === 'ai';
              const isSystem = msg.senderType === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono">
                      {msg.content}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex flex-col group',
                    isCustomer ? 'items-start' : 'items-end'
                  )}
                >
                  {/* Sender Header */}
                  <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {msg.senderName}
                    </span>
                    {isAi && (
                      <span className="px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 text-[9px] font-semibold flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5" /> AI Agent
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">
                      {formatTimeAgo(msg.timestamp)}
                    </span>
                  </div>

                  {/* Tool Execution Event Trace */}
                  {msg.toolExecutions && msg.toolExecutions.length > 0 && (
                    <div className="mb-2 max-w-lg w-full space-y-1.5">
                      {msg.toolExecutions.map((tool: ToolExecutionEvent, idx: number) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-slate-900/90 border border-indigo-500/30 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between text-[11px] text-indigo-300 mb-1">
                            <span className="flex items-center gap-1 font-bold">
                              <Zap className="w-3.5 h-3.5 text-indigo-400" />
                              AI Agent called {tool.toolName}
                            </span>
                            <span className="text-emerald-400 font-semibold">✓ Completed</span>
                          </div>
                          {tool.output && (
                            <div className="bg-slate-950 p-1.5 rounded text-[10px] text-slate-400 overflow-x-auto">
                              {typeof tool.output === 'string'
                                ? tool.output
                                : JSON.stringify(tool.output)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      'max-w-xl rounded-2xl px-4 py-3 text-xs leading-relaxed relative',
                      isCustomer
                        ? 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                        : isAi
                        ? 'bg-indigo-950/40 border border-indigo-500/40 text-slate-100 rounded-br-none shadow-sm shadow-indigo-500/10'
                        : 'bg-indigo-600 text-white rounded-br-none'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {/* Quick copy & thumbs feedback */}
                    <div className="mt-2 pt-1 border-t border-slate-700/40 flex items-center justify-end gap-2 text-slate-400">
                      <button
                        onClick={() => handleCopyMessage(msg.id, msg.content)}
                        className="hover:text-slate-200 transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                      {isAi && (
                        <>
                          <button className="hover:text-emerald-400 transition-colors">
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button className="hover:text-rose-400 transition-colors">
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Composer */}
          <div className="p-3 bg-slate-900/60 border-t border-slate-800">
            {/* Quick Copilot Prompts */}
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto scrollbar-none text-[11px]">
              <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Copilot Shortcuts:
              </span>
              <button
                onClick={() =>
                  setInputText(
                    'I have checked the tracking status. The shipment cleared customs at Chicago and is guaranteed for delivery tomorrow at 9:00 AM.'
                  )
                }
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
              >
                Delivery ETA Confirmed
              </button>
              <button
                onClick={() =>
                  setInputText(
                    'I have generated a prepaid return RMA label and authorized a full refund to your original payment card.'
                  )
                }
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 shrink-0"
              >
                Issue Prepaid Return
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Attach document or image"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your reply as Devon Miles (or use Copilot prompt)..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button type="submit" variant="primary" size="md" isLoading={sendMutation.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* RIGHT PANE: Customer CRM & Order Information Panel */}
        {selectedConv && (
          <div className="w-80 border-l border-slate-800/80 bg-slate-900/40 flex flex-col shrink-0 overflow-y-auto p-4 space-y-5">
            {/* Customer Avatar & Company */}
            <div className="text-center pb-4 border-b border-slate-800/80">
              <img
                src={selectedConv.customer.avatar}
                alt={selectedConv.customer.name}
                className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-indigo-500/20 mb-2"
              />
              <h3 className="text-sm font-bold text-white">{selectedConv.customer.name}</h3>
              <p className="text-xs text-slate-400">{selectedConv.customer.company}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Badge variant="purple" className="text-[10px]">
                  {selectedConv.customer.plan} Plan
                </Badge>
                <Badge variant={selectedConv.customer.sentimentScore > 50 ? 'success' : 'danger'} className="text-[10px]">
                  Sentiment: {selectedConv.customer.sentimentScore}%
                </Badge>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-200 truncate">{selectedConv.customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-200">{selectedConv.customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-200 font-semibold">
                  LTV: {formatCurrency(selectedConv.customer.lifetimeValue)}
                </span>
              </div>
            </div>

            {/* Customer Tags */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Customer Tags
              </span>
              <div className="flex flex-wrap gap-1">
                {selectedConv.customer.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2 flex items-center justify-between">
                <span>Recent Orders</span>
                <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              </span>
              <div className="space-y-2">
                {selectedConv.customer.orders.map((ord: any) => (
                  <div
                    key={ord.id}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center justify-between font-semibold text-slate-200">
                      <span>{ord.id}</span>
                      <span className="text-emerald-400">{formatCurrency(ord.amount)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ord.items}</p>
                    <div className="flex items-center justify-between mt-1 text-[10px]">
                      <span className="text-slate-500">{ord.date}</span>
                      <span className="text-indigo-400 font-medium">{ord.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Internal Notes */}
            {selectedConv.customer.notes && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide block mb-1">
                  Stakeholder Note
                </span>
                <p className="text-amber-200/90 text-[11px] leading-relaxed">
                  {selectedConv.customer.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
