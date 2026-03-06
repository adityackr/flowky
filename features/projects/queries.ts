import { DATABASE_ID, PROJECTS_ID } from '@/config/env';
import { createSessionClient } from '@/lib/appwrite';
import { getMember } from '../members/utils';
import { Project } from './types';

export const getProject = async ({ projectId }: { projectId: string }) => {
	const { account, tablesDB } = await createSessionClient();

	const user = await account.get();

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
		throw new Error('Unauthorized');
	}

	return project;
};
