import { Models } from 'node-appwrite';

export enum MemberRole {
	ADMIN = 'ADMIN',
	MEMBER = 'MEMBER',
}

export type Member = Models.Row & {
	name: string;
	email: string;
	userId: string;
	workspaceId: string;
	role: MemberRole;
};
