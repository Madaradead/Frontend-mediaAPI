import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email required').email('Incorrect email format'),
  password: z.string().min(6, 'The password must contain at least 6 characters.'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters long.'),
  email: z.string().min(1, 'Email required').email('Incorrect email format'),
  password: z.string().min(6, 'The password must contain at least 6 characters.'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
