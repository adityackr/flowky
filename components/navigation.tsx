'use client';

import { navigationRoutes } from '@/config/navigation-config';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navigation = () => {
	const workspaceId = useWorkspaceId();
	const pathname = usePathname();

	return (
		<ul className="flex flex-col">
			{navigationRoutes.map((route) => {
				const fullHref = `/workspaces/${workspaceId}${route.href}`;
				const isActive = pathname === fullHref;
				const Icon = isActive ? route.activeIcon : route.icon;

				return (
					<Link href={fullHref} key={route.label}>
						<div
							className={cn(
								'flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500',
								isActive && 'bg-white shadow-sm hover:opacity-100 text-primary',
							)}
						>
							<Icon className="size-5 text-neutral-500" />
							{route.label}
						</div>
					</Link>
				);
			})}
		</ul>
	);
};
