import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { useDeleteTask } from '../api/use-delete-task';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

type TaskActionsProps = {
	id: string;
	projectId: string;
	children: ReactNode;
};

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const { mutate, isPending } = useDeleteTask();
	const [ConfirmDialog, confirm] = useConfirm(
		'Delete Task',
		'Are you sure you want to delete this task? This action cannot be undone.',
		'destructive',
	);
	const { open } = useEditTaskModal();

	const handleDelete = async () => {
		const confirmed = await confirm();

		if (!confirmed) {
			return;
		}

		mutate({ param: { taskId: id } });
	};

	const handleOpenTaskDetails = () => {
		router.push(`/workspaces/${workspaceId}/tasks/${id}`);
	};

	const handleOpenProject = () => {
		router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
	};

	return (
		<div className="flex justify-end">
			<ConfirmDialog />
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={handleOpenTaskDetails}
						className="font-medium p-2.5"
					>
						<ExternalLinkIcon className="size-4 stroke-2" />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleOpenProject}
						className="font-medium p-2.5"
					>
						<ExternalLinkIcon className="size-4 stroke-2" />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => open(id)}
						className="font-medium p-2.5"
					>
						<PencilIcon className="size-4 stroke-2" />
						Edit Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={handleDelete}
						disabled={isPending}
						className="text-amber-700 hover:text-amber-700 font-medium p-2.5"
					>
						<TrashIcon className="size-4 stroke-2" />
						Delete Task
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};
