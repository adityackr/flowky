import { DottedSeparator } from '@/components/dotted-separator';
import { EntityAvatar } from '@/components/entity-avatar';
import { MoreHorizontal } from 'lucide-react';
import { Task } from '../types';
import { TaskActions } from './task-actions';
import { TaskDate } from './task-date';

type KanbanCardProps = {
	task: Task;
};

export const KanbanCard = ({ task }: KanbanCardProps) => {
	return (
		<div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
			<div className="flex items-start justify-between gap-x-2.5">
				<p className="text-sm line-clamp-2">{task.name}</p>
				<TaskActions id={task.$id} projectId={task.projectId}>
					<MoreHorizontal className="size-4.5 stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
				</TaskActions>
			</div>
			<DottedSeparator />

			<div className="flex items-center gap-x-1.5">
				<EntityAvatar
					name={task.assignee?.name || 'Unassigned'}
					className="size-6 rounded-full"
					fallbackClassName="bg-neutral-200 text-neutral-700 text-xs font-medium"
				/>
				<div className="size-1 rounded-full bg-neutral-300" />
				<TaskDate value={task.dueDate} className="text-xs" />
			</div>

			<div className="flex items-center gap-x-1.5">
				<EntityAvatar
					name={task.project?.name || 'Unassigned'}
					image={task.project?.imageUrl}
					className="size-6"
					fallbackClassName="text-xs font-medium"
				/>
				<span className="text-xs font-medium">{task.project?.name}</span>
			</div>
		</div>
	);
};
