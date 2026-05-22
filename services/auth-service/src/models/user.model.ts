import { Schema, model, Document } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: 'customer' | 'admin' | 'seller';
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ['customer', 'admin', 'seller'], default: 'customer' },
    refreshTokenHash: { type: String, required: false },
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>('User', userSchema);
