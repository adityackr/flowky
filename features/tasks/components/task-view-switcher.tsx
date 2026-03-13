'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useModalState } from '@/hooks/use-modal-state';
import { Loader2, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { useBulkUpdateTasks } from '../api/use-bulk-update-tasks';
import { useGetTasks } from '../api/use-get-tasks';
import { useTaskFilters } from '../hooks/use-task-filters';
import { TaskStatus } from '../types';
import { columns } from './columns';
import { DataCalendar } from './data-calendar';
import { DataFilters } from './data-filters';
import { DataKanban } from './data-kanban';
import { DataTable } from './data-table';

export const TaskViewSwitcher = () => {
	const [{ status, projectId, assigneeId, dueDate }] = useTaskFilters();
	const [view, setView] = useQueryState('task-view', {
		defaultValue: 'table',
	});
	const workspaceId = useWorkspaceId();
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
		status,
		projectId,
		assigneeId,
		dueDate,
	});
	const { open } = useModalState('create-task');
	const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

	const onKanbanChange = useCallback(
		(tasks: { $id: string; status: TaskStatus; position: number }[]) => {
			bulkUpdateTasks({ json: { tasks } });
		},
		[bulkUpdateTasks],
	);

	return (
		<Tabs
			className="w-full flex-1 border rounded-lg"
			defaultValue={view}
			onValueChange={setView}
		>
			<div className="h-full flex flex-col overflow-auto p-4">
				<div className="flex items-center gap-y-2 justify-between flex-col lg:flex-row">
					<TabsList className="w-full lg:w-auto" variant={'line'}>
						<TabsTrigger className="h-8 w-full lg:w-auto" value="table">
							Table
						</TabsTrigger>
						<TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
							Kanban
						</TabsTrigger>
						<TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
							Calendar
						</TabsTrigger>
					</TabsList>

					<Button size={'sm'} className="w-full lg:w-auto" onClick={open}>
						<PlusIcon className="size-4" />
						New Task
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				<DataFilters />
				<DottedSeparator className="my-4" />
				{isLoadingTasks ? (
					<div className="w-full border rounded-lg h-50 flex flex-col items-center justify-center">
						<Loader2 className="size-5 animate-spin text-muted-foreground" />
					</div>
				) : (
					<>
						<TabsContent value="table">
							<DataTable columns={columns} data={tasks?.rows ?? []} />
						</TabsContent>
						<TabsContent value="kanban">
							<DataKanban data={tasks?.rows ?? []} onChange={onKanbanChange} />
						</TabsContent>
						<TabsContent value="calendar" className="h-full pb-4">
							<DataCalendar data={tasks?.rows ?? []} />
						</TabsContent>
					</>
				)}
			</div>
		</Tabs>
	);
};
