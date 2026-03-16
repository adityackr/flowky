import { EntityAvatar } from '@/components/entity-avatar';
import { Project } from '@/features/projects/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Assignee, TaskStatus } from '../types';

interface EventCardProps {
	id: string;
	title: string;
	project: Project;
	assignee: Assignee;
	status: TaskStatus;
}

const statusColorMap: Record<TaskStatus, string> = {
	[TaskStatus.BACKLOG]: 'border-l-pink-500',
	[TaskStatus.TODO]: 'border-l-red-500',
	[TaskStatus.IN_PROGRESS]: 'border-l-yellow-500',
	[TaskStatus.IN_REVIEW]: 'border-l-blue-500',
	[TaskStatus.DONE]: 'border-l-emerald-500',
};

export const EventCard = ({
	id,
	title,
	project,
	assignee,
	status,
}: EventCardProps) => {
	const workspaceId = useWorkspaceId();
	const router = useRouter();

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		router.push(`/workspaces/${workspaceId}/tasks/${id}`);
	};

	return (
		<div className="px-2">
			<div
				className={cn(
					'p-1.5 text-xs bg-white text-primary rounded-md border border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition',
					statusColorMap[status],
				)}
				onClick={handleClick}
			>
				<p>{title}</p>
				<div className="flex items-center flex-col md:flex-row gap-1">
					<EntityAvatar
						name={assignee?.name}
						className="size-6 rounded-full"
						fallbackClassName="bg-neutral-200 font-medium text-xs text-neutral-700"
					/>
					<div className="size-1 rounded-full bg-neutral-300" />
					<EntityAvatar
						name={project?.name}
						image={project?.imageUrl}
						className="size-6"
						fallbackClassName="font-medium text-xs"
					/>
				</div>
			</div>
		</div>
	);
};
