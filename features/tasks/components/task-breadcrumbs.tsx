import { EntityAvatar } from '@/components/entity-avatar';
import { Button } from '@/components/ui/button';
import { Project } from '@/features/projects/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';
import { ChevronRight, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDeleteTask } from '../api/use-delete-task';
import { Task } from '../types';

interface TaskBreadcrumbsProps {
	project: Project;
	task: Task;
}

export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();

	const { mutate: deleteTask, isPending } = useDeleteTask();
	const [ConfirmDialog, confirm] = useConfirm(
		'Delete Task?',
		'Are you sure you want to delete this task? This action cannot be undone.',
		'destructive',
	);

	const handleDeleteTask = async () => {
		const ok = await confirm();

		if (!ok) return;

		deleteTask(
			{ param: { taskId: task.$id } },
			{
				onSuccess: () => {
					router.push(`/workspaces/${workspaceId}/tasks`);
				},
			},
		);
	};

	return (
		<div className="flex items-center gap-x-2">
			<ConfirmDialog />
			<EntityAvatar
				name={project.name}
				image={project.imageUrl}
				className="size-6 lg:size-8"
				fallbackClassName="text-xs lg:text-sm"
			/>

			<Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
				<p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
					{project.name}
				</p>
			</Link>

			<ChevronRight className="size-4 lg:size-5 text-muted-foreground" />

			<p className="text-sm lg:text-lg font-semibold">{task.name}</p>

			<Button
				className="ml-auto"
				variant={'destructive'}
				size="sm"
				onClick={handleDeleteTask}
				disabled={isPending}
			>
				<TrashIcon className="size-4" />
				<span className="hidden lg:block">Delete Task</span>
			</Button>
		</div>
	);
};
