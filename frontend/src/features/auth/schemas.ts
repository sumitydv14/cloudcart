import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters'),
});

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm your password'),
    role: z.enum(['customer', 'seller', 'admin']),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({ path: ['confirmPassword'], message: 'Passwords must match', code: 'custom' });
    }
  });
