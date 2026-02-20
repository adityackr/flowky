'use client';

import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export const MobileSidebar = () => {
	const pathname = usePathname();

	return (
		<Sheet modal={false} key={pathname}>
			<SheetTrigger asChild>
				<Button variant={'secondary'} className="lg:hidden">
					<MenuIcon className="size-4 text-neutral-500" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="p-0">
				<Sidebar />
			</SheetContent>
		</Sheet>
	);
};
