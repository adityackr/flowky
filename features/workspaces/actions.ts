'use server';

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config/env';
import { cookies } from 'next/headers';
import { Account, Client, Query, TablesDB } from 'node-appwrite';
import { AUTH_COOKIE } from '../auth/constants';

export const getWorkspaces = async () => {
	try {
		const client = new Client()
			.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
			.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

		const session = (await cookies()).get(AUTH_COOKIE);

		if (!session) return { rows: [], total: 0 };

		client.setSession(session.value);

		const tablesDB = new TablesDB(client);
		const account = new Account(client);

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
