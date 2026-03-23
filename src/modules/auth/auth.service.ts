import { AppError } from '../../utils/AppError';
import { generateToken } from '../../utils/jwt';
import * as authRepo from './auth.repository';

/**
 * Register a new user and return JWT token.
 */
export const registerUser = async (input: authRepo.RegisterInput) => {
  const user = await authRepo.createUser(input);
  const token = generateToken({ id: user.id, role: user.role });
  return { user, token };
};

/**
 * Login: validate credentials and return JWT token.
 */
export const loginUser = async (phone: string, password: string) => {
  // Find user including hashed password
  const user = await authRepo.findUserByPhone(phone);
  if (!user) {
    throw new AppError('Invalid phone number or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated.', 403);
  }

  const isMatch = await authRepo.verifyPassword(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid phone number or password.', 401);
  }

  const token = generateToken({ id: user.id, role: user.role });

  // Strip password before returning
  const { password: _pw, ...safeUser } = user.toJSON();
  return { user: safeUser, token };
};

/**
 * Get logged-in user profile by id.
 */
export const getMyProfile = async (userId: string) => {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};
