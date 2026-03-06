'use client';

import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';
import { EntityAvatar } from './entity-avatar';

export const Projects = () => {
	const workspaceId = useWorkspaceId();
	const { open } = useCreateProjectModal();
	const pathname = usePathname();
	const { data: projects } = useGetProjects({
		workspaceId,
	});

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex items-center justify-between">
				<p className="text-xs text-neutral-500 uppercase">Projects</p>
				<RiAddCircleFill
					className="text-neutral-500 size-5 cursor-pointer hover:opacity-75 transition"
					onClick={open}
				/>
			</div>

			<div>
				{projects?.rows.map((project) => {
					const href = `/workspaces/${workspaceId}/projects/${project.$id}`;
					const isActive = pathname === href;

					return (
						<Link key={project.$id} href={href}>
							<div
								className={cn(
									'flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500',
									isActive &&
										'bg-white shadow-sm hover:opacity-100 text-primary',
								)}
							>
								<EntityAvatar
									image={project.imageUrl}
									name={project.name}
									className="size-5"
									fallbackClassName="text-xs"
								/>
								<span className="truncate">{project.name}</span>
							</div>
						</Link>
					);
				})}
			</div>
		</div>
	);
};
