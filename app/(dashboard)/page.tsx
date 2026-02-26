import { getCurrent } from '@/features/auth/queries';
import { getWorkspaces } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

const HomePage = async () => {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	const workspaces = await getWorkspaces();
	if (workspaces.total === 0) {
		redirect('/workspaces/create');
	} else {
		redirect(`/workspaces/${workspaces.rows[0].$id}`);
	}
};

export default HomePage;
