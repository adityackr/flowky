import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';
import { ID } from 'node-appwrite';
import { AUTH_COOKIE } from '../constants';
import { loginSchema, signUpSchema } from '../schemas';

const app = new Hono()
	.get('/current', sessionMiddleware, async (c) => {
		const user = c.get('user');

		return c.json({ data: user });
	})
	.post('/login', zValidator('json', loginSchema), async (c) => {
		const { email, password } = c.req.valid('json');

		const { account } = await createAdminClient();

		const session = await account.createEmailPasswordSession({
			email,
			password,
		});

		setCookie(c, AUTH_COOKIE, session.secret, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
		});

		return c.json({ success: true });
	})
	.post('/register', zValidator('json', signUpSchema), async (c) => {
		const { name, email, password } = c.req.valid('json');

		const { account } = await createAdminClient();

		await account.create({
			userId: ID.unique(),
			email,
			password,
			name,
		});

		const session = await account.createEmailPasswordSession({
			email,
			password,
		});

		setCookie(c, AUTH_COOKIE, session.secret, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 24 * 30,
		});

		return c.json({ success: true });
	})
	.post('/logout', sessionMiddleware, async (c) => {
		const account = c.get('account');

		deleteCookie(c, AUTH_COOKIE);

		await account.deleteSessions();

		return c.json({ success: true });
	});

export default app;
