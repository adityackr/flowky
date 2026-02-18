import auth from '@/features/auth/server/route';
import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api');

const routes = app.route('/auth', auth);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
