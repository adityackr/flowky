'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
	const pathname = usePathname();

	return (
		<main className="bg-neutral-100 min-h-screen">
			<div className="mx-auto max-w-screen-2xl p-4">
				<nav className="flex justify-between items-center">
					<Image src="/logo.svg" alt="Logo" width={130} height={56} />
					<Button variant={'secondary'}>
						<Link href={pathname === '/sign-up' ? '/sign-in' : '/sign-up'}>
							{pathname === '/sign-up' ? 'Sign In' : 'Sign Up'}
						</Link>
					</Button>
				</nav>
				<div className="flex flex-col items-center justify-center pt-4 md:pt-14">
					{children}
				</div>
			</div>
		</main>
	);
};

export default AuthLayout;
