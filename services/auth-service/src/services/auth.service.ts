import { randomBytes } from 'crypto';
import { UserModel, UserDocument } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash.util';
import { signAccessToken } from '../utils/jwt.util';
import bcrypt from 'bcrypt';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const registerUser = async (name: string, email: string, password: string, role: string = 'customer') => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({ name, email, passwordHash, role });
  return user;
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    throw new Error('Invalid credentials');
  }

  return user;
};

export const issueTokens = async (user: UserDocument): Promise<AuthTokens> => {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const refreshToken = randomBytes(64).toString('hex');
  const refreshTokenHash = await bcrypt.hash(refreshToken, 12);

  user.refreshTokenHash = refreshTokenHash;
  await user.save();

  return { accessToken, refreshToken };
};

export const validateRefreshToken = async (userId: string, refreshToken: string) => {
  const user = await UserModel.findById(userId);
  if (!user || !user.refreshTokenHash) {
    throw new Error('Invalid refresh token');
  }

  const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!valid) {
    throw new Error('Invalid refresh token');
  }

  return user;
};

export const revokeRefreshToken = async (user: UserDocument) => {
  user.refreshTokenHash = undefined;
  await user.save();
};
