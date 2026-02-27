import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/env';
import { createSessionClient } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { getMember } from '../members/utils';
import { Workspace } from './types';

export const getWorkspaces = async () => {
	try {
		const { account, tablesDB } = await createSessionClient();

		const user = await account.get();

		const members = await tablesDB.listRows({
			databaseId: DATABASE_ID,
			tableId: MEMBERS_ID,
			queries: [Query.equal('userId', user.$id)],
		});

		if (members.total === 0) {
			return { rows: [], total: 0 };
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

		return workspaces;
	} catch {
		return { rows: [], total: 0 };
	}
};

export const getWorkspace = async ({
	workspaceId,
}: {
	workspaceId: string;
}) => {
	try {
		const { account, tablesDB } = await createSessionClient();

		const user = await account.get();

		const member = await getMember({
			tablesDB,
			userId: user.$id,
			workspaceId,
		});

		if (!member) return null;

		const workspace = await tablesDB.getRow<Workspace>({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			rowId: workspaceId,
		});

		return workspace;
	} catch {
		return null;
	}
};

export const getWorkspaceInfo = async ({
	workspaceId,
}: {
	workspaceId: string;
}) => {
	try {
		const { tablesDB } = await createSessionClient();

		const workspace = await tablesDB.getRow<Workspace>({
			databaseId: DATABASE_ID,
			tableId: WORKSPACES_ID,
			rowId: workspaceId,
		});

		return { name: workspace.name };
	} catch {
		return null;
	}
};
