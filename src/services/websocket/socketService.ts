import { io, Socket } from 'socket.io-client';

type SocketEventHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<SocketEventHandler>> = new Map();
  public isConnected: boolean = false;
  private simulationTimer: any = null;

  init() {
    const socketUrl = import.meta.env.VITE_WS_URL || 'http://localhost:5000';
    try {
      this.socket = io(socketUrl, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 3000,
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        this.isConnected = true;
        this.broadcastLocal('status:connected', { connected: true });
      });

      this.socket.on('disconnect', () => {
        this.isConnected = false;
        this.broadcastLocal('status:disconnected', { connected: false });
      });

      // Register real-time event proxies
      const events = [
        'ticket:new',
        'message:new',
        'ticket:assigned',
        'ticket:status_changed',
        'ai:response',
        'typing:indicator',
        'agent:presence',
        'notification:new',
        'voice:transcript',
        'ticket:escalated',
      ];

      events.forEach((evt) => {
        this.socket?.on(evt, (data) => {
          this.broadcastLocal(evt, data);
        });
      });

      // Attempt non-blocking connection
      this.socket.connect();
    } catch {
      this.isConnected = false;
    }
  }

  // Subscribe to real-time events
  on(event: string, callback: SocketEventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // Dispatch events to active subscribers
  emit(event: string, data: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
    // Also trigger locally for immediate feedback
    this.broadcastLocal(event, data);
  }

  // Broadcast to all internal UI listeners
  broadcastLocal(event: string, data: any) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (e) {
          console.error(`Socket event handler error on "${event}":`, e);
        }
      });
    }
  }

  // Live simulation mode trigger for demo and testing without external backend
  simulateIncomingCustomerMessage(conversationId: string, text: string) {
    this.broadcastLocal('typing:indicator', {
      conversationId,
      senderType: 'customer',
      isTyping: true,
    });

    setTimeout(() => {
      this.broadcastLocal('typing:indicator', {
        conversationId,
        senderType: 'customer',
        isTyping: false,
      });

      this.broadcastLocal('message:new', {
        id: `msg-${Date.now()}`,
        conversationId,
        senderType: 'customer',
        senderName: 'Olivia Sterling',
        senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        content: text,
        timestamp: new Date().toISOString(),
        status: 'delivered',
      });
    }, 1200);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    if (this.simulationTimer) {
      clearInterval(this.simulationTimer);
    }
  }
}

export const socketService = new SocketService();
