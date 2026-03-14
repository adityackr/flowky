import { DottedSeparator } from '@/components/dotted-separator';
import { EntityAvatar } from '@/components/entity-avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { PencilIcon } from 'lucide-react';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { Task } from '../types';
import { OverviewProperty } from './overview-property';
import { TaskDate } from './task-date';

interface TaskOverviewProps {
	task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
	const { open } = useEditTaskModal();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-muted rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Overview</p>
					<Button onClick={() => open(task.$id)} size="sm" variant="secondary">
						<PencilIcon className="size-4" />
						Edit
					</Button>
				</div>

				<DottedSeparator className="my-4" />

				<div className="flex flex-col gap-y-4">
					<OverviewProperty label="Assignee">
						<EntityAvatar
							name={task.assignee?.name || 'Unassigned'}
							className="size-6 rounded-full"
							fallbackClassName="text-xs text-neutral-700 font-medium bg-neutral-200"
						/>

						<p className="text-sm font-medium">
							{task.assignee?.name || 'Unassigned'}
						</p>
					</OverviewProperty>

					<OverviewProperty label="Due Date">
						<TaskDate value={task.dueDate} className="text-sm font-medium" />
					</OverviewProperty>

					<OverviewProperty label="status">
						<Badge variant={task.status}>
							{snakeCaseToTitleCase(task.status)}
						</Badge>
					</OverviewProperty>
				</div>
			</div>
		</div>
	);
};
