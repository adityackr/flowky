import { Models } from 'node-appwrite';
import { Project } from '../projects/types';

export enum TaskStatus {
	BACKLOG = 'BACKLOG',
	TODO = 'TODO',
	IN_PROGRESS = 'IN_PROGRESS',
	IN_REVIEW = 'IN_REVIEW',
	DONE = 'DONE',
}

export type Assignee = Models.Row & {
	name: string;
	email: string;
};

export type Task = Models.Row & {
	name: string;
	status: TaskStatus;
	workspaceId: string;
	assigneeId: string;
	projectId: string;
	position: number;
	dueDate: string;
	project?: Project;
	assignee?: Assignee;
};
