import { DATABASE_ID, MEMBERS_ID } from '@/config/env';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/sesssion-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { Query } from 'node-appwrite';
import z from 'zod';
import { MemberRole } from '../types';
import { getMember } from '../utils';

const app = new Hono()
	.get(
		'/',
		sessionMiddleware,
		zValidator('query', z.object({ workspaceId: z.string() })),
		async (c) => {
			const { users } = await createAdminClient();
			const tablesDB = c.get('tablesDB');
			const user = c.get('user');
			const { workspaceId } = c.req.valid('query');

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

			const members = await tablesDB.listRows({
				databaseId: DATABASE_ID,
				tableId: MEMBERS_ID,
				queries: [Query.equal('workspaceId', workspaceId)],
			});

			const populatedMembers = await Promise.all(
				members.rows.map(async (member) => {
					const user = await users.get(member.userId);
					return {
						...member,
						name: user.name,
						email: user.email,
					};
				}),
			);

			return c.json({
				data: {
					...members,
					rows: populatedMembers,
				},
			});
		},
	)
	.delete('/:memberId', sessionMiddleware, async (c) => {
		const tablesDB = c.get('tablesDB');
		const user = c.get('user');
		const { memberId } = c.req.param();

		const memberToDelete = await tablesDB.getRow({
			databaseId: DATABASE_ID,
			tableId: MEMBERS_ID,
			rowId: memberId,
		});

		const allMembersInWorkspace = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: MEMBERS_ID,
			queries: [Query.equal('workspaceId', memberToDelete.workspaceId)],
		});

		const member = await getMember({
			tablesDB,
			userId: user.$id,
			workspaceId: memberToDelete.workspaceId,
		});

		if (!member) {
			return c.json(
				{
					error: 'Unauthorized',
				},
				401,
			);
		}

		if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
			return c.json(
				{
					error: 'Unauthorized',
				},
				401,
			);
		}

		if (allMembersInWorkspace.total === 1) {
			return c.json(
				{
					error: 'Cannot delete last member',
				},
				400,
			);
		}

		await tablesDB.deleteRow({
			databaseId: DATABASE_ID,
			tableId: MEMBERS_ID,
			rowId: memberId,
		});

		return c.json({
			data: {
				$id: memberToDelete.$id,
			},
		});
	})
	.patch(
		'/:memberId',
		sessionMiddleware,
		zValidator('json', z.object({ role: z.enum(MemberRole) })),
		async (c) => {
			const tablesDB = c.get('tablesDB');
			const user = c.get('user');
			const { memberId } = c.req.param();
			const { role } = c.req.valid('json');

			const memberToUpdate = await tablesDB.getRow({
				databaseId: DATABASE_ID,
				tableId: MEMBERS_ID,
				rowId: memberId,
			});

			const allMembersInWorkspace = await tablesDB.listRows({
				databaseId: DATABASE_ID,
				tableId: MEMBERS_ID,
				queries: [Query.equal('workspaceId', memberToUpdate.workspaceId)],
			});

			const member = await getMember({
				tablesDB,
				userId: user.$id,
				workspaceId: memberToUpdate.workspaceId,
			});

			if (!member) {
				return c.json(
					{
						error: 'Unauthorized',
					},
					401,
				);
			}

			if (member.role !== MemberRole.ADMIN) {
				return c.json(
					{
						error: 'Unauthorized',
					},
					401,
				);
			}

			if (allMembersInWorkspace.total === 1) {
				return c.json(
					{
						error: 'Cannot downgrade the only member',
					},
					400,
				);
			}

			await tablesDB.updateRow({
				databaseId: DATABASE_ID,
				tableId: MEMBERS_ID,
				rowId: memberId,
				data: {
					role,
				},
			});

			return c.json({
				data: {
					$id: memberToUpdate.$id,
				},
			});
		},
	);

export default app;
