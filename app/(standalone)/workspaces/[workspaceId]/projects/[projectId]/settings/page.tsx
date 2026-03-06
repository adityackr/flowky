import { getCurrent } from '@/features/auth/queries';
import { EditProjectForm } from '@/features/projects/components/edit-project-form';
import { getProject } from '@/features/projects/queries';
import { redirect } from 'next/navigation';

type ProjectSettingsPageProps = {
	params: Promise<{ projectId: string }>;
};

const ProjectSettingsPage = async ({ params }: ProjectSettingsPageProps) => {
	const user = await getCurrent();

	if (!user) redirect('/sign-in');

	const { projectId } = await params;

	const project = await getProject({
		projectId,
	});

	const initialValues = JSON.parse(JSON.stringify(project));

	return (
		<div>
			<EditProjectForm initialValues={initialValues} />
		</div>
	);
};

export default ProjectSettingsPage;
