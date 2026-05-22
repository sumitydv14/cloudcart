import { Request, Response, NextFunction } from 'express';
import { AuthTokens, authenticateUser, issueTokens, registerUser, validateRefreshToken, revokeRefreshToken } from '../services/auth.service';
import { config } from '../config';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await registerUser(name, email, password, role);
    const tokens: AuthTokens = await issueTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    const tokens: AuthTokens = await issueTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    const { userId } = req.body;
    if (!refreshTokenCookie || !userId) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const user = await validateRefreshToken(userId, refreshTokenCookie);
    const tokens: AuthTokens = await issueTokens(user);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      accessToken: tokens.accessToken,
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    const { userId } = req.body;
    if (userId && refreshTokenCookie) {
      const user = await validateRefreshToken(userId, refreshTokenCookie);
      await revokeRefreshToken(user);
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};