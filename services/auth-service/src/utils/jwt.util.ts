import jwt, {Secret, SignOptions} from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, config.jwtSecret as Secret, { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
