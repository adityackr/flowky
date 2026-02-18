'use client';

import { Button } from '@/components/ui/button';
import { useCurrent } from '@/features/auth/api/use-current';
import { useLogout } from '@/features/auth/api/use-logout';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage = () => {
	const { data: user, isLoading } = useCurrent();
	const router = useRouter();
	const { mutate: logout } = useLogout();

	useEffect(() => {
		if (!user && !isLoading) {
			router.push('/sign-in');
		}
	}, [user, isLoading, router]);

	return (
		<div>
			<h1>{user?.name}</h1>
			<Button onClick={() => logout()}>Logout</Button>
		</div>
	);
};

export default HomePage;
