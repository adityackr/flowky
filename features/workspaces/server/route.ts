import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from '@/config/env';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID } from 'node-appwrite';
import { createWorkspaceSchema } from '../schemas';

const app = new Hono().post(
	'/',
	zValidator('form', createWorkspaceSchema),
	sessionMiddleware,
	async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');
		const storage = c.get('storage');

		const { name, image } = c.req.valid('form');

		let uploadedImageUrl: string | undefined;

		if (image instanceof File) {
			const file = await storage.createFile({
				bucketId: IMAGES_BUCKET_ID,
				fileId: ID.unique(),
				file: image,
			});

			const arraybuffer = await storage.getFilePreview({
				bucketId: IMAGES_BUCKET_ID,
				fileId: file.$id,
			});

			uploadedImageUrl = `data:image/png;base64,${Buffer.from(arraybuffer).toString('base64')}`;
		}

		const workspace = await tablesDB.createRow({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			rowId: ID.unique(),
			data: {
				name,
				userId: user.$id,
				imageUrl: uploadedImageUrl,
			},
		});

		return c.json({ data: workspace });
	},
);

export default app;
