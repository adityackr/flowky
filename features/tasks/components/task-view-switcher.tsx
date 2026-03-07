import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon } from 'lucide-react';

export const TaskViewSwitcher = () => {
	return (
		<Tabs className="w-full flex-1 border rounded-lg" defaultValue="table">
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

					<Button size={'sm'} className="w-full lg:w-auto">
						<PlusIcon className="size-4" />
						New Task
					</Button>
				</div>
				<DottedSeparator className="my-4" />
				Data Filters
				<DottedSeparator className="my-4" />
				<>
					<TabsContent value="table">Data Table</TabsContent>
					<TabsContent value="kanban">Data Kanban</TabsContent>
					<TabsContent value="calendar">Data Calendar</TabsContent>
				</>
			</div>
		</Tabs>
	);
};
