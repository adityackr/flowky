import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config/env';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import z from 'zod';
import { createTaskServerSchema } from '../schemas';
import { Task, TaskStatus } from '../types';

const app = new Hono()
	.get(
		'/',
		sessionMiddleware,
		zValidator(
			'query',
			z.object({
				workspaceId: z.string(),
				projectId: z.string().nullish(),
				assigneeId: z.string().nullish(),
				search: z.string().nullish(),
				dueDate: z.string().nullish(),
				status: z.enum(TaskStatus).nullish(),
			}),
		),
		async (c) => {
			const { users } = await createAdminClient();
			const tablesDB = c.get('tablesDB');
			const user = c.get('user');

			const { workspaceId, projectId, assigneeId, search, dueDate, status } =
				c.req.valid('query');

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId,
			});

			if (!member) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const query = [
				Query.equal('workspaceId', workspaceId),
				Query.orderDesc('$createdAt'),
			];

			if (projectId) {
				query.push(Query.equal('projectId', projectId));
			}

			if (status) {
				query.push(Query.equal('status', status));
			}

			if (assigneeId) {
				query.push(Query.equal('assigneeId', assigneeId));
			}

			if (dueDate) {
				query.push(Query.equal('dueDate', dueDate));
			}

			if (search) {
				query.push(Query.search('name', search));
			}

			const tasks = await tablesDB.listRows<Task>({
				databaseId: DATABASE_ID,
				tableId: TASKS_ID,
				queries: query,
			});

			const projectIds = tasks.rows.map((task) => task.projectId);
			const assigneeIds = tasks.rows.map((task) => task.assigneeId);

			const projects = await tablesDB.listRows<Project>({
				databaseId: DATABASE_ID,
				tableId: PROJECTS_ID,
				queries:
					projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
			});

			const members = await tablesDB.listRows({
				databaseId: DATABASE_ID,
				tableId: MEMBERS_ID,
				queries:
					assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
			});

			const assignees = await Promise.all(
				members.rows.map(async (member) => {
					const user = await users.get(member.userId);
					return {
						...member,
						name: user.name,
						email: user.email,
					};
				}),
			);

			const populatedTasks = tasks.rows.map((task) => {
				const project = projects.rows.find(
					(project) => project.$id === task.projectId,
				);
				const assignee = assignees.find(
					(assignee) => assignee.$id === task.assigneeId,
				);
				return {
					...task,
					project,
					assignee,
				};
			});

			return c.json({ data: { ...tasks, rows: populatedTasks } });
		},
	)
	.post(
		'/',
		sessionMiddleware,
		zValidator('json', createTaskServerSchema),
		async (c) => {
			const user = c.get('user');
			const tablesDB = c.get('tablesDB');
			const {
				name,
				status,
				workspaceId,
				projectId,
				dueDate,
				assigneeId,
				description,
			} = c.req.valid('json');

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId,
			});

			if (!member) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const highestPositionTask = await tablesDB.listRows({
				databaseId: DATABASE_ID,
				tableId: TASKS_ID,
				queries: [
					Query.equal('status', status),
					Query.equal('workspaceId', workspaceId),
					Query.orderAsc('position'),
					Query.limit(1),
				],
			});

			const newPosition =
				highestPositionTask.rows.length > 0
					? highestPositionTask.rows[0].position + 1000
					: 1000;

			const task = await tablesDB.createRow({
				databaseId: DATABASE_ID,
				tableId: TASKS_ID,
				rowId: ID.unique(),
				data: {
					name,
					status,
					workspaceId,
					projectId,
					dueDate,
					assigneeId,
					description,
					position: newPosition,
				},
			});

			return c.json({ data: task });
		},
	);

export default app;
