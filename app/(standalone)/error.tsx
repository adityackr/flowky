'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const ErrorPage = () => {
	return (
		<div className="flex h-screen flex-col items-center justify-center gap-y-4">
			<AlertTriangle className="size-6 text-muted-foreground" />
			<p className="text-sm text-muted-foreground">Something went wrong</p>
			<Button variant={'secondary'} size="sm" asChild>
				<Link href="/">Go back to home</Link>
			</Button>
		</div>
	);
};

export default ErrorPage;
