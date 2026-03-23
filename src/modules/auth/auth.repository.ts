import bcrypt from 'bcryptjs';
import { User } from '../../models';
import { AppError } from '../../utils/AppError';

// ── Types ───────────────────────────────────────────────────
export interface RegisterInput {
  name: string;
  phone: string;
  password: string;
  role: 'customer' | 'provider';
}

/**
 * Find a user by phone number (used during login).
 */
export const findUserByPhone = async (phone: string) => {
  return User.findOne({ where: { phone } });
};

/**
 * Find a user by primary key (UUID).
 */
export const findUserById = async (id: string) => {
  return User.findByPk(id, {
    attributes: { exclude: ['password'] }, // never return password
  });
};

/**
 * Create a new user with hashed password.
 */
export const createUser = async (data: RegisterInput) => {
  const existing = await findUserByPhone(data.phone);
  if (existing) {
    throw new AppError('Phone number already registered.', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await User.create({
    name: data.name,
    phone: data.phone,
    password: hashedPassword,
    role: data.role,
  });

  // Return user without password
  const { password: _pw, ...safeUser } = user.toJSON();
  return safeUser;
};

/**
 * Verify plain password against stored hash.
 */
export const verifyPassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
