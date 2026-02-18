import z from 'zod';

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1, 'Password is required'),
});

export const signUpSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters long'),
	email: z.email(),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
