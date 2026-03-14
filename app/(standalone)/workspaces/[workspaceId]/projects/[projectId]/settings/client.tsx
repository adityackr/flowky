'use client';

import { useGetProject } from '@/features/projects/api/use-get-project';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';

export const ProjectSettingsClient = () => {
	const projectId = useProjectId();

	const { data: project, isLoading } = useGetProject({ projectId });

	if (isLoading) {
		return <PageLoader />;
	}

	if (!project) {
		return <PageError message="Project not found" />;
	}

	return (
		<div>
			<EditProjectForm initialValues={project} />
		</div>
	);
};