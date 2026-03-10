import z from 'zod';
import { TaskStatus } from './types';

// Client-side schema: dueDate is a Date object (from the DatePicker)
export const createTaskSchema = z.object({
	name: z.string().trim().min(1, 'Name is required'),
	status: z.enum(TaskStatus, 'Status is required'),
	workspaceId: z.string().trim().min(1, 'Workspace ID is required'),
	projectId: z.string().trim().min(1, 'Project ID is required'),
	dueDate: z.date(),
	assigneeId: z.string().trim().min(1, 'Assignee ID is required'),
	description: z.string().optional(),
});

// Server-side schema: dueDate arrives as an ISO string in JSON, coerce it to Date
export const createTaskServerSchema = createTaskSchema.extend({
	dueDate: z.coerce.date(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
	taskId: z.string().trim().min(1, 'Task ID is required'),
});

export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
