import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

const inter = Inter({
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Flowky',
	description:
		'Flowky is a modern, full-stack project management and collaboration platform built to help teams organize tasks, manage projects, and collaborate efficiently.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={cn(inter.className, 'antialiased min-h-screen')}>
				<NuqsAdapter>
					<QueryProvider>
						{children}
						<Toaster />
					</QueryProvider>
				</NuqsAdapter>
			</body>
		</html>
	);
}
