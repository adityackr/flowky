import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';
import { SettingsClient } from './client';

const SettingsPage = async () => {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	return <SettingsClient />;
};

export default SettingsPage;
