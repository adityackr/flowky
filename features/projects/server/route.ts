import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID } from '@/config/env';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';
import { createProjectSchema, updateProjectSchema } from '../schemas';
import { Project } from '../types';

const app = new Hono()
	.get(
		'/',
		sessionMiddleware,
		zValidator('query', z.object({ workspaceId: z.string() })),
		async (c) => {
			const user = c.get('user');
			const tablesDB = c.get('tablesDB');

			const { workspaceId } = c.req.valid('query');

			if (!workspaceId) {
				return c.json(
					{
						error: 'Workspace ID is required',
					},
					400,
				);
			}

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId,
			});

			if (!member) {
				return c.json(
					{
						error: 'Unauthorized',
					},
					401,
				);
			}

			const projects = await tablesDB.listRows({
				databaseId: DATABASE_ID,
				tableId: PROJECTS_ID,
				queries: [
					Query.equal('workspaceId', workspaceId),
					Query.orderDesc('$createdAt'),
				],
			});

			return c.json({
				data: projects,
			});
		},
	)
	.post(
		'/',
		sessionMiddleware,
		zValidator('form', createProjectSchema),
		async (c) => {
			const tablesDB = c.get('tablesDB');
			const user = c.get('user');
			const storage = c.get('storage');

			const { name, image, workspaceId } = c.req.valid('form');

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId,
			});

			if (!member) {
				return c.json(
					{
						error: 'Unauthorized',
					},
					401,
				);
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
			}

			const project = await tablesDB.createRow({
				databaseId: DATABASE_ID,
				tableId: PROJECTS_ID,
				rowId: ID.unique(),
				data: {
					name,
					imageUrl: uploadedImageUrl,
					workspaceId,
				},
			});

			return c.json({ data: project });
		},
	)
	.patch(
		'/:projectId',
		sessionMiddleware,
		zValidator('form', updateProjectSchema),
		async (c) => {
			const tablesDB = c.get('tablesDB');
			const user = c.get('user');
			const storage = c.get('storage');

			const { projectId } = c.req.param();
			const { name, image } = c.req.valid('form');

			const existingProject = await tablesDB.getRow<Project>({
				databaseId: DATABASE_ID,
				tableId: PROJECTS_ID,
				rowId: projectId,
			});

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId: existingProject.workspaceId,
			});

			if (!member) {
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

			const project = await tablesDB.updateRow({
				databaseId: DATABASE_ID,
				tableId: PROJECTS_ID,
				rowId: projectId,
				data: {
					name,
					imageUrl: uploadedImageUrl ?? null,
				},
			});

			return c.json({ data: project });
		},
	)
	.delete('/:projectId', sessionMiddleware, async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');

		const { projectId } = c.req.param();

		const existingProject = await tablesDB.getRow<Project>({
			databaseId: DATABASE_ID,
			tableId: PROJECTS_ID,
			rowId: projectId,
		});

		const member = await getMember({
			tablesDB,
			userId: user.$id,
			workspaceId: existingProject.workspaceId,
		});

		if (!member) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		// TODO: Delete tasks

		await tablesDB.deleteRow({
			databaseId: DATABASE_ID,
			tableId: PROJECTS_ID,
			rowId: projectId,
		});

		return c.json({ data: { $id: existingProject.$id } });
	});

export default app;
