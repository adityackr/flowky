import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { snakeCaseToTitleCase } from '@/lib/utils';
import {
	CircleCheckIcon,
	CircleDashedIcon,
	CircleDotDashedIcon,
	CircleDotIcon,
	CircleIcon,
	PlusIcon,
} from 'lucide-react';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { TaskStatus } from '../types';

type KanbanColumnHeaderProps = {
	board: TaskStatus;
	taskCount: number;
};

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
	[TaskStatus.BACKLOG]: <CircleDashedIcon className="size-4.5 text-pink-600" />,
	[TaskStatus.TODO]: <CircleIcon className="size-4.5 text-red-600" />,
	[TaskStatus.IN_PROGRESS]: (
		<CircleDotDashedIcon className="size-4.5 text-yellow-600 [&_circle:last-child]:scale-[3] [&_circle:last-child]:fill-current [&_circle:last-child]:origin-center" />
	),
	[TaskStatus.IN_REVIEW]: (
		<CircleDotIcon className="size-4.5 text-blue-600 [&_circle:last-child]:scale-[3] [&_circle:last-child]:fill-current [&_circle:last-child]:origin-center" />
	),
	[TaskStatus.DONE]: <CircleCheckIcon className="size-4.5 text-emerald-600" />,
};

export const KanbanColumnHeader = ({
	board,
	taskCount,
}: KanbanColumnHeaderProps) => {
	const { open } = useCreateTaskModal();

	const icon = statusIconMap[board];

	return (
		<div className="flex items-center justify-between px-2 py-1.5">
			<div className="flex items-center gap-x-2">
				{icon}
				<h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
				<Badge variant={board} className="size-5">
					{taskCount}
				</Badge>
			</div>

			<Button
				onClick={() => open(board)}
				variant="ghost"
				size="icon"
				className="size-5"
			>
				<PlusIcon className="size-4 text-neutral-500" />
			</Button>
		</div>
	);
};
