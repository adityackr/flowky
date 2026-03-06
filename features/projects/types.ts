import { Models } from 'node-appwrite';

export type Project = Models.Row & {
	name: string;
	imageUrl: string;
	workspaceId: string;
};
