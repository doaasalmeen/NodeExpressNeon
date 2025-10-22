import { z } from 'zod';

export const userIdSchema = z.object({
  id: z
    .string()
    .min(1, 'User ID is required')
    .regex(/^\d+$/, 'User ID must be a valid number')
    .transform(val => parseInt(val, 10)),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(255).trim().optional(),
  email: z.string().email().max(255).toLowerCase().trim().optional(),
  password: z.string().min(6).max(128).optional(),
  role: z.enum(['user', 'admin']).optional(),
});
