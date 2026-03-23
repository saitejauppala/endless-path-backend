import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface JwtPayload {
  id: string;
  role: 'customer' | 'provider' | 'admin';
}

/**
 * Generate a signed JWT token
 * @param payload - user id and role
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify a JWT token and return payload
 * @param token - token string from Authorization header
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
};
