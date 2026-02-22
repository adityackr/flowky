'use client';

import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { WorkspaceAvatar } from '@/features/workspaces/components/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

export const WorkspaceSwitcher = () => {
	const workspaceId = useWorkspaceId();
	const router = useRouter();
	const { data: workspaces } = useGetWorkspaces();
	const { open } = useCreateWorkspaceModal();

	const onSelectWorkspace = (id: string) => {
		router.push(`/workspaces/${id}`);
	};

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs text-neutral-500 uppercase">Workspaces</p>
				<RiAddCircleFill
					className="text-neutral-500 size-5 cursor-pointer hover:opacity-75 transition"
					onClick={open}
				/>
			</div>
			<Select onValueChange={onSelectWorkspace} value={workspaceId}>
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
