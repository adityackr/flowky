import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { TaskDetailPageClient } from './client';

const TaskDetailPage = async () => {
	const user = await getCurrent();

	if (!user) redirect('/sign-in');

	return <TaskDetailPageClient />;
};

export default TaskDetailPage;
