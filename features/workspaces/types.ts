import { Models } from 'node-appwrite';

export type Workspace = Models.Row & {
	name: string;
	imageUrl: string;
	inviteCode: string;
	userId: string;
};
