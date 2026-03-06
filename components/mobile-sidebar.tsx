'use client';

import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { VisuallyHidden } from 'radix-ui';
import { Sidebar } from './sidebar';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from './ui/sheet';

export const MobileSidebar = () => {
	const pathname = usePathname();

	return (
		<Sheet modal={false} key={pathname}>
			<SheetTrigger asChild>
				<Button variant={'secondary'} className="lg:hidden">
					<MenuIcon className="size-4 text-neutral-500" />
				</Button>
			</SheetTrigger>
			<SheetHeader>
				<SheetTitle>
					<VisuallyHidden.Root asChild>
						<p>Menu</p>
					</VisuallyHidden.Root>
				</SheetTitle>
			</SheetHeader>
			<SheetContent side="left" className="p-0">
				<ScrollArea className="h-full">
					<Sidebar />
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
};
