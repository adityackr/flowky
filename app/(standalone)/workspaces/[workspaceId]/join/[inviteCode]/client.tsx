'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspaceInfo } from '@/features/workspaces/api/use-get-workspace-info';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceJoinClient = () => {
	const workspaceId = useWorkspaceId();
	const { data: workspace, isLoading } = useGetWorkspaceInfo({
		workspaceId,
	});

	if (isLoading) {
		return <PageLoader />;
	}

	if (!workspace) {
		return <PageError message="Workspace not found" />;
	}

	return (
		<div className="w-full lg:max-w-xl">
			<JoinWorkspaceForm initialValues={{ name: workspace.name }} />
		</div>
	);
};
