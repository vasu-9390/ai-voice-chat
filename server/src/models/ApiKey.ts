
import { Schema, model, Document, Types } from 'mongoose';

export interface IApiKey extends Document {
  name: string;
  keyPrefix: string;
  keyHash: string;
  organizationId: Types.ObjectId;
  isActive: boolean;
  expiresAt?: Date;
  lastUsedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    keyPrefix: {
      type: String,
      required: true,
      index: true,
    },
    keyHash: {
      type: String,
      required: true,
      select: false,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ApiKeySchema.index({ keyPrefix: 1, isActive: 1 });

export const ApiKey = model<IApiKey>('ApiKey', ApiKeySchema);
