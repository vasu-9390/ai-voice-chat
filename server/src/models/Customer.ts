import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomerOrder {
  orderId: string;
  date: Date;
  amount: number;
  currency: string;
  status: 'DELIVERED' | 'IN_TRANSIT' | 'PROCESSING' | 'REFUNDED' | 'CANCELLED';
  itemsSummary: string;
  trackingNumber?: string;
  carrier?: string;
  isEligibleForRefund: boolean;
}

export interface ICustomer extends Document {
  organizationId: Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  plan: 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';
  tags: string[];
  lifetimeValue: number;
  totalOrders: number;
  sentimentScore: number; // 0 - 100
  recentSentiment: 'POSITIVE' | 'NEUTRAL' | 'FRUSTRATED' | 'ANGRY';
  orders: ICustomerOrder[];
  metadata: Record<string, any>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerOrderSchema = new Schema<ICustomerOrder>(
  {
    orderId: { type: String, required: true },
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['DELIVERED', 'IN_TRANSIT', 'PROCESSING', 'REFUNDED', 'CANCELLED'],
      default: 'PROCESSING',
    },
    itemsSummary: { type: String, required: true },
    trackingNumber: { type: String },
    carrier: { type: String },
    isEligibleForRefund: { type: Boolean, default: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    plan: {
      type: String,
      enum: ['FREE', 'PRO', 'BUSINESS', 'ENTERPRISE'],
      default: 'FREE',
    },
    tags: [{ type: String, trim: true }],
    lifetimeValue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    sentimentScore: { type: Number, default: 75 },
    recentSentiment: {
      type: String,
      enum: ['POSITIVE', 'NEUTRAL', 'FRUSTRATED', 'ANGRY'],
      default: 'NEUTRAL',
    },
    orders: [CustomerOrderSchema],
    metadata: { type: Schema.Types.Mixed, default: {} },
    notes: { type: String },
  },
  { timestamps: true }
);

// Compound indexes
CustomerSchema.index({ organizationId: 1, email: 1 }, { unique: true });
CustomerSchema.index({ organizationId: 1, 'orders.orderId': 1 });

export const Customer = model<ICustomer>('Customer', CustomerSchema);
