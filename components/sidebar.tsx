import Image from 'next/image';
import Link from 'next/link';
import { DottedSeparator } from './dotted-separator';
import { Navigation } from './navigation';
import { WorkspaceSwitcher } from './workspace-switcher';

export const Sidebar = () => {
	return (
		<aside className="w-full h-full bg-neutral-100 p-4">
			<Link href="/">
				<Image src="/logo.svg" alt="Flowky Logo" width={130} height={56} />
			</Link>
			<DottedSeparator className="my-4" />
			<WorkspaceSwitcher />
			<DottedSeparator className="my-4" />
			<Navigation />
		</aside>
	);
};
