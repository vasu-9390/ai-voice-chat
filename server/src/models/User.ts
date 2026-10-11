import { Schema, model, Document, Types } from 'mongoose';
import { UserRole } from '../constants/roles';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  organizationId: Types.ObjectId;
  status: 'ONLINE' | 'AWAY' | 'OFFLINE';
  isEmailVerified: boolean;
  avatar?: string;
  department?: string;
  refreshTokenHash?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.SUPPORT_AGENT,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['ONLINE', 'AWAY', 'OFFLINE'],
      default: 'OFFLINE',
    },
    isEmailVerified: { type: Boolean, default: false },
    avatar: { type: String },
    department: { type: String },
    refreshTokenHash: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    emailVerificationToken: { type: String, select: false },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Compound index: email must be unique per organization tenant
UserSchema.index({ organizationId: 1, email: 1 }, { unique: true });

export const User = model<IUser>('User', UserSchema);
