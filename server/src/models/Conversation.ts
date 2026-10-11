import { Schema, model, Document, Types } from 'mongoose';
import { ConversationStatus, TicketPriority } from '../constants/statuses';

export interface IConversation extends Document {
  organizationId: Types.ObjectId;
  customerId: Types.ObjectId;
  assignedAgentId?: Types.ObjectId;
  ticketId?: Types.ObjectId;
  status: ConversationStatus;
  channel: 'WEB' | 'VOICE' | 'EMAIL' | 'WHATSAPP' | 'SLACK';
  priority: TicketPriority;
  subject?: string;
  lastMessageSnippet?: string;
  lastMessageAt: Date;
  isEscalated: boolean;
  escalationReason?: string;
  unreadAgentCount: number;
  unreadCustomerCount: number;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
      index: true,
    },
    assignedAgentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    status: {
      type: String,
      enum: Object.values(ConversationStatus),
      default: ConversationStatus.AI_HANDLING,
      index: true,
    },
    channel: {
      type: String,
      enum: ['WEB', 'VOICE', 'EMAIL', 'WHATSAPP', 'SLACK'],
      default: 'WEB',
    },
    priority: {
      type: String,
      enum: Object.values(TicketPriority),
      default: TicketPriority.MEDIUM,
      index: true,
    },
    subject: { type: String, trim: true },
    lastMessageSnippet: { type: String },
    lastMessageAt: { type: Date, default: Date.now, index: true },
    isEscalated: { type: Boolean, default: false, index: true },
    escalationReason: { type: String },
    unreadAgentCount: { type: Number, default: 0 },
    unreadCustomerCount: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

ConversationSchema.index({ organizationId: 1, status: 1, lastMessageAt: -1 });

export const Conversation = model<IConversation>('Conversation', ConversationSchema);
