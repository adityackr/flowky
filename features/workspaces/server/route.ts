import {
	DATABASE_ID,
	IMAGES_BUCKET_ID,
	MEMBERS_ID,
	WORKSPACES_ID,
} from '@/config/env';
import { MemberRole } from '@/features/members/types';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { generateInviteCode } from '@/lib/utils';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { createWorkspaceSchema, editWorkspaceSchema } from '../schemas';

const app = new Hono()
	.get('/', sessionMiddleware, async (c) => {
		const user = c.get('user');
		const tablesDB = c.get('tablesDB');

		const members = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: MEMBERS_ID,
			queries: [Query.equal('userId', user.$id)],
		});

		if (members.total === 0) {
			return c.json({ data: { rows: [], total: 0 } });
		}

		const workspaceIds = members.rows.map((row) => row.workspaceId);

		const workspaces = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			queries: [
				Query.orderDesc('$createdAt'),
				Query.contains('$id', workspaceIds),
			],
		});

		return c.json({ data: workspaces });
	})
	.post(
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
					inviteCode: generateInviteCode(6),
				},
			});

			await tablesDB.createRow({
				databaseId: DATABASE_ID,
				tableId: MEMBERS_ID,
				rowId: ID.unique(),
				data: {
					workspaceId: workspace.$id,
					userId: user.$id,
					role: MemberRole.ADMIN,
				},
			});

			return c.json({ data: workspace });
		},
	)
	.patch(
		'/:workspaceId',
		sessionMiddleware,
		zValidator('form', editWorkspaceSchema),
		async (c) => {
			const tablesDB = c.get('tablesDB');
			const user = c.get('user');
			const storage = c.get('storage');

			const { workspaceId } = c.req.param();
			const { name, image } = c.req.valid('form');

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId,
			});

			if (!member || member.role !== MemberRole.ADMIN) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

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
			} else {
				uploadedImageUrl = image ?? undefined;
			}

			const workspace = await tablesDB.updateRow({
				databaseId: DATABASE_ID,
				tableId: WORKSPACES_ID,
				rowId: workspaceId,
				data: {
					name,
					imageUrl: uploadedImageUrl ?? null,
				},
			});

			return c.json({ data: workspace });
		},
	)
	.delete('/:workspaceId', sessionMiddleware, async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');

		const { workspaceId } = c.req.param();

		const member = await getMember({
			tablesDB,
			userId: user.$id,
			workspaceId,
		});

		if (!member || member.role !== MemberRole.ADMIN) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		// TODO: Delete members, projects and tasks

		await tablesDB.deleteRow({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			rowId: workspaceId,
		});

		return c.json({ data: { $id: workspaceId } });
	})
	.post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');

		const { workspaceId } = c.req.param();

		const member = await getMember({
			tablesDB,
			userId: user.$id,
			workspaceId,
		});

		if (!member || member.role !== MemberRole.ADMIN) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		const workspace = await tablesDB.updateRow({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			rowId: workspaceId,
			data: {
				inviteCode: generateInviteCode(6),
			},
		});

		return c.json({ data: workspace });
	});

export default app;
