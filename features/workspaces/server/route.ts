import { DATABASE_ID, WORKSPACES_ID } from '@/config/env';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID } from 'node-appwrite';
import { createWorkspaceSchema } from '../schemas';

const app = new Hono().post(
	'/',
	zValidator('json', createWorkspaceSchema),
	sessionMiddleware,
	async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');

		const { name } = c.req.valid('json');

		const workspace = await tablesDB.createRow({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			rowId: ID.unique(),
			data: {
				name,
				userId: user.$id,
			},
		});

		return c.json({ data: workspace });
	},
);

export default app;
