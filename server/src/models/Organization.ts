import { Schema, model, Document } from 'mongoose';
import { SubscriptionPlan } from '../constants/statuses';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  plan: SubscriptionPlan;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  settings: {
    timezone: string;
    businessHoursStart: string;
    businessHoursEnd: string;
    autoEscalateNegativeSentiment: boolean;
    confidenceThreshold: number;
    defaultLanguage: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
      index: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'SUSPENDED', 'TRIAL'],
      default: 'ACTIVE',
      index: true,
    },
    stripeCustomerId: { type: String, sparse: true, index: true },
    stripeSubscriptionId: { type: String, sparse: true },
    settings: {
      timezone: { type: String, default: 'UTC' },
      businessHoursStart: { type: String, default: '00:00' },
      businessHoursEnd: { type: String, default: '23:59' },
      autoEscalateNegativeSentiment: { type: Boolean, default: true },
      confidenceThreshold: { type: Number, default: 0.85 },
      defaultLanguage: { type: String, default: 'en' },
    },
  },
  { timestamps: true }
);

export const Organization = model<IOrganization>('Organization', OrganizationSchema);
