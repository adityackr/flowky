import { navigationRoutes } from '@/config/navigation-config';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export const Navigation = () => {
	return (
		<ul className="flex flex-col">
			{navigationRoutes.map((route) => {
				const isActive = false;
				const Icon = isActive ? route.activeIcon : route.icon;

				return (
					<Link href={route.href} key={route.href}>
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
