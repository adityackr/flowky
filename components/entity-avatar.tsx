import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface EntityAvatarProps {
	image?: string;
	name: string;
	className?: string;
	fallbackClassName?: string;
}

export const EntityAvatar = ({
	image,
	name,
	className,
	fallbackClassName,
}: EntityAvatarProps) => {
	if (image) {
		return (
			<div
				className={cn('size-10 relative rounded-md overflow-hidden', className)}
			>
				<Image src={image} alt={name} fill className="object-cover" />
			</div>
		);
	}

	return (
		<Avatar className={cn('size-10 rounded-md', className)}>
			<AvatarFallback
				className={cn(
					'text-white bg-blue-600 font-semibold text-lg uppercase rounded-md',
					fallbackClassName,
				)}
			>
				{name.charAt(0)}
			</AvatarFallback>
		</Avatar>
	);
};
