import z from 'zod';
import { TaskStatus } from './types';

export const createTaskSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	status: z.enum(TaskStatus, 'Status is required'),
	workspaceId: z.string().trim().min(1, 'Workspace ID is required'),
	projectId: z.string().trim().min(1, 'Project ID is required'),
	dueDate: z.coerce.date(),
	assigneeId: z.string().trim().min(1, 'Assignee ID is required'),
	description: z.string().optional(),
});
