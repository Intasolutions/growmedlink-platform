import jwt from 'jsonwebtoken';
import { IUser } from '@intelligen/types';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'temp_jwt_access_secret_growmedlink';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'temp_jwt_refresh_secret_growmedlink';

export interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate a short-lived access token (expires in 15 minutes)
 */
export const generateAccessToken = (user: { _id: any; email: string; role: string }): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
};

/**
 * Generate a long-lived refresh token (expires in 7 days)
 */
export const generateRefreshToken = (user: { _id: any; email: string; role: string }): string => {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

/**
 * Verify access token and return payload
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
};

/**
 * Verify refresh token and return payload
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
};
