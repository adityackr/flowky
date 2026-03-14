'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const SettingsClient = () => {
	const workspaceId = useWorkspaceId();
	const { data: workspace, isLoading } = useGetWorkspace({ workspaceId });

	if (isLoading) {
		return <PageLoader />;
	}

	if (!workspace) {
		return <PageError message="Workspace not found" />;
	}

	return <EditWorkspaceForm initialValues={workspace} />;
};
