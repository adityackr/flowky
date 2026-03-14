'use client';

import { EntityAvatar } from '@/components/entity-avatar';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { Button } from '@/components/ui/button';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';

export const ProjectPageClient = () => {
	const projectId = useProjectId();

	const { data: project, isLoading } = useGetProject({ projectId });

	if (isLoading) {
		return <PageLoader />;
	}

	if (!project) {
		return <PageError message="Project not found" />;
	}

	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<EntityAvatar
						name={project.name}
						image={project.imageUrl}
						className="size-8"
					/>
					<p className="text-lg font-semibold">{project.name}</p>
				</div>

				<div>
					<Button variant={'secondary'} size="sm" asChild>
						<Link
							href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
						>
							<PencilIcon className="size-4" />
							Edit Project
						</Link>
					</Button>
				</div>
			</div>
			<TaskViewSwitcher hideProjectFilter />
		</div>
	);
};
