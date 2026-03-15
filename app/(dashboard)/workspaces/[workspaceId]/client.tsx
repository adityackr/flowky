'use client';

import { Analytics } from '@/components/analytics';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { HomeMembersList } from '@/features/members/components/home-members-list';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { ProjectList } from '@/features/projects/components/project-list';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { TaskList } from '@/features/tasks/components/task-list';
import { useGetWorkspaceAnalytics } from '@/features/workspaces/api/use-get-wprkspace-analytics';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceClient = () => {
	const workspaceId = useWorkspaceId();

	const { data: analytics, isLoading: isLoadingAnalytics } =
		useGetWorkspaceAnalytics({
			workspaceId,
		});
	const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
		workspaceId,
	});
	const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
		workspaceId,
	});
	const { data: members, isLoading: isLoadingMembers } = useGetMembers({
		workspaceId,
	});

	const isLoading =
		isLoadingAnalytics ||
		isLoadingTasks ||
		isLoadingProjects ||
		isLoadingMembers;

	if (isLoading) return <PageLoader />;

	if (!analytics || !tasks || !projects || !members)
		return <PageError message="Failed to load workspace data" />;

	return (
		<div className="h-full flex flex-col space-y-4">
			<Analytics data={analytics} />
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
				<TaskList tasks={tasks.rows} total={tasks.total} />
				<ProjectList projects={projects.rows} total={projects.total} />
				<HomeMembersList members={members.rows} total={members.total} />
			</div>
		</div>
	);
};
