import { DATABASE_ID, MEMBERS_ID } from '@/config/env';
import { Query, type TablesDB } from 'node-appwrite';

type GetMemberParams = {
	tablesDB: TablesDB;
	userId: string;
	workspaceId: string;
};

export const getMember = async ({
	tablesDB,
	userId,
	workspaceId,
}: GetMemberParams) => {
	const member = await tablesDB.listRows({
		databaseId: DATABASE_ID,
		tableId: MEMBERS_ID,
		queries: [
			Query.equal('workspaceId', workspaceId),
			Query.equal('userId', userId),
		],
	});

	return member.rows[0];
};
