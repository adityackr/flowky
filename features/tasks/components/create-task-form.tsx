'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { EntityAvatar } from '@/components/entity-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateTask } from '../api/use-create-task';
import { createTaskSchema, type CreateTaskSchema } from '../schemas';
import { TaskStatus } from '../types';

interface CreateTaskFormProps {
	onCancel?: () => void;
	projectOptions: { id: string; name: string; imageUrl: string }[];
	memberOptions: { id: string; name: string }[];
	defaultStatus?: TaskStatus;
}

export const CreateTaskForm = ({
	onCancel,
	projectOptions,
	memberOptions,
	defaultStatus,
}: CreateTaskFormProps) => {
	const workspaceId = useWorkspaceId();
	const { mutate, isPending } = useCreateTask();

	const form = useForm<CreateTaskSchema>({
		resolver: zodResolver(createTaskSchema),
		defaultValues: {
			workspaceId,
			...(defaultStatus ? { status: defaultStatus } : {}),
		},
	});

	const handleSubmit = (data: CreateTaskSchema) => {
		mutate(
			{ json: { ...data, workspaceId } },
			{
				onSuccess: () => {
					form.reset();
					onCancel?.();
				},
			},
		);
	};

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="flex px-4">
				<CardTitle className="text-xl font-bold">Create a new task</CardTitle>
			</CardHeader>
			<div className="px-4">
				<DottedSeparator />
			</div>

			<CardContent className="px-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="flex flex-col gap-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Task name</FormLabel>
										<FormControl>
											<Input placeholder="Task name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="dueDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Due Date</FormLabel>
										<FormControl>
											<DatePicker {...field} placeholder="Select a Date" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="assigneeId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Assignee</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Assignee" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{memberOptions.map((member) => (
													<SelectItem key={member.id} value={member.id}>
														<div className="flex items-center gap-x-2">
															<EntityAvatar
																className="size-6 rounded-full"
																fallbackClassName="text-sm font-medium bg-neutral-200 text-neutral-700"
																name={member.name}
															/>
															<p>{member.name}</p>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Status" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												<SelectItem value={TaskStatus.BACKLOG}>
													Backlog
												</SelectItem>
												<SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
												<SelectItem value={TaskStatus.IN_PROGRESS}>
													In Progress
												</SelectItem>
												<SelectItem value={TaskStatus.IN_REVIEW}>
													In Review
												</SelectItem>
												<SelectItem value={TaskStatus.DONE}>Done</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="projectId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Project</FormLabel>
										<Select
											defaultValue={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select Project" />
												</SelectTrigger>
											</FormControl>
											<FormMessage />
											<SelectContent>
												{projectOptions.map((project) => (
													<SelectItem key={project.id} value={project.id}>
														<div className="flex items-center gap-x-2">
															<EntityAvatar
																className="size-6"
																fallbackClassName="text-sm font-medium"
																name={project.name}
																image={project.imageUrl}
															/>
															<p>{project.name}</p>
														</div>
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DottedSeparator className="py-6" />
						<div className="flex items-center justify-between">
							<Button
								type="button"
								size={'lg'}
								variant="secondary"
								onClick={onCancel}
								disabled={isPending}
								className={cn(!onCancel && 'invisible')}
							>
								Cancel
							</Button>
							<Button type="submit" size={'lg'} disabled={isPending}>
								Create Task
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
