import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { ProjectPageClient } from './client';

const ProjectPage = async () => {
	const user = await getCurrent();

	if (!user) {
		redirect('/sign-in');
	}

	return <ProjectPageClient />;
};

export default ProjectPage;
