import {
	DATABASE_ID,
	IMAGES_BUCKET_ID,
	PROJECTS_ID,
	TASKS_ID,
} from '@/config/env';
import { getMember } from '@/features/members/utils';
import { TaskStatus } from '@/features/tasks/types';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
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

			const projects = await tablesDB.listRows<Project>({
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
	.get('/:projectId', sessionMiddleware, async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');

		const { projectId } = c.req.param();

		const project = await tablesDB.getRow<Project>({
			databaseId: DATABASE_ID,
			tableId: PROJECTS_ID,
			rowId: projectId,
		});

		const member = await getMember({
			tablesDB,
			userId: user.$id,
			workspaceId: project.workspaceId,
		});

		if (!member) {
			return c.json({ error: 'Unauthorized' }, 401);
		}

		return c.json({ data: project });
	})
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
	})
	.get('/:projectId/analytics', sessionMiddleware, async (c) => {
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

		const now = new Date();
		const thisMonthStart = startOfMonth(now);
		const thisMonthEnd = endOfMonth(now);
		const lastMonthStart = startOfMonth(subMonths(now, 1));
		const lastMonthEnd = endOfMonth(subMonths(now, 1));

		const thisMonthTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
			],
		});

		const lastMonthTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
			],
		});

		const taskCount = thisMonthTasks.total;
		const lastMonthTaskCount = lastMonthTasks.total;

		const taskDifference = taskCount - lastMonthTaskCount;

		const thisMonthAssignedTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.equal('assigneeId', member.$id),
				Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
			],
		});

		const lastMonthAssignedTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.equal('assigneeId', member.$id),
				Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
			],
		});

		const thisMonthAssignedTaskCount = thisMonthAssignedTasks.total;
		const lastMonthAssignedTaskCount = lastMonthAssignedTasks.total;

		const assignedTaskDifference =
			thisMonthAssignedTaskCount - lastMonthAssignedTaskCount;

		const thisMonthIncompleteTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.notEqual('status', TaskStatus.DONE),
				Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
			],
		});

		const lastMonthIncompleteTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.notEqual('status', TaskStatus.DONE),
				Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
			],
		});

		const thisMonthIncompleteTaskCount = thisMonthIncompleteTasks.total;
		const lastMonthIncompleteTaskCount = lastMonthIncompleteTasks.total;

		const incompleteTaskDifference =
			thisMonthIncompleteTaskCount - lastMonthIncompleteTaskCount;

		const thisMonthCompletedTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.equal('status', TaskStatus.DONE),
				Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
			],
		});

		const lastMonthCompletedTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.equal('status', TaskStatus.DONE),
				Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
			],
		});

		const thisMonthCompletedTaskCount = thisMonthCompletedTasks.total;
		const lastMonthCompletedTaskCount = lastMonthCompletedTasks.total;

		const completedTaskDifference =
			thisMonthCompletedTaskCount - lastMonthCompletedTaskCount;

		const thisMonthOverdueTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.notEqual('status', TaskStatus.DONE),
				Query.lessThan('dueDate', now.toISOString()),
				Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
			],
		});

		const lastMonthOverdueTasks = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: TASKS_ID,
			queries: [
				Query.equal('projectId', projectId),
				Query.notEqual('status', TaskStatus.DONE),
				Query.lessThan('dueDate', now.toISOString()),
				Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
				Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
			],
		});

		const thisMonthOverdueTaskCount = thisMonthOverdueTasks.total;
		const lastMonthOverdueTaskCount = lastMonthOverdueTasks.total;

		const overdueTaskDifference =
			thisMonthOverdueTaskCount - lastMonthOverdueTaskCount;

		return c.json({
			data: {
				taskCount,
				taskDifference,
				assignedTaskCount: thisMonthAssignedTaskCount,
				assignedTaskDifference,
				incompleteTaskCount: thisMonthIncompleteTaskCount,
				incompleteTaskDifference,
				completedTaskCount: thisMonthCompletedTaskCount,
				completedTaskDifference,
				overdueTaskCount: thisMonthOverdueTaskCount,
				overdueTaskDifference,
			},
		});
	});

export default app;
