'use client';

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar';
import { RiAddCircleFill } from 'react-icons/ri';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

export const WorkspaceSwitcher = () => {
	const { data: workspaces } = useGetWorkspaces();

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs text-neutral-500 uppercase">Workspaces</p>
				<RiAddCircleFill className="text-neutral-500 size-5 cursor-pointer hover:opacity-75 transition" />
			</div>
			<Select>
				<SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
					<SelectValue placeholder="No workspace selected" />
				</SelectTrigger>
				<SelectContent>
					{workspaces?.rows.map((workspace) => (
						<SelectItem value={workspace.$id} key={workspace.$id}>
							<div className="flex justify-start items-center gap-3 font-medium">
								<WorkspaceAvatar
									image={workspace.imageUrl}
									name={workspace.name}
								/>
								<span className="truncate">{workspace.name}</span>
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};
