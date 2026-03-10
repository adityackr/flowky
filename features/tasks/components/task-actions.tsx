import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { ReactNode } from 'react';

type TaskActionsProps = {
	id: string;
	projectId: string;
	children: ReactNode;
};

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
	return (
		<div className="flex justify-end">
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-48">
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="font-medium p-2.5"
					>
						<ExternalLinkIcon className="size-4 stroke-2" />
						Task Details
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="font-medium p-2.5"
					>
						<ExternalLinkIcon className="size-4 stroke-2" />
						Open Project
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
						className="font-medium p-2.5"
					>
						<PencilIcon className="size-4 stroke-2" />
						Edit Task
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {}}
						disabled={false}
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
