import { cn } from '@/lib/utils';
import { FC } from 'react';

type DottedSeparatorProps = {
	className?: string;
	color?: string;
	height?: string;
	dotSize?: string;
	gapSize?: string;
	direction?: 'horizontal' | 'vertical';
};

export const DottedSeparator: FC<DottedSeparatorProps> = ({
	className,
	color = '#d4d4d8',
	height = '2px',
	dotSize = '2px',
	gapSize = '6px',
	direction = 'horizontal',
}) => {
	const isHorizontal = direction === 'horizontal';

	return (
		<div
			className={cn(
				isHorizontal
					? 'w-full flex items-center'
					: 'hh-full flex flex-col items-center',
				className,
			)}
		>
			<div
				className={cn(isHorizontal ? 'grow' : 'grow-0')}
				style={{
					width: isHorizontal ? '100%' : height,
					height: isHorizontal ? height : '100%',
					backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
					backgroundSize: isHorizontal
						? `${parseInt(dotSize) + parseInt(gapSize)}px ${height}`
						: `${height} ${parseInt(dotSize) + parseInt(gapSize)}px`,
					backgroundPosition: 'center',
					backgroundRepeat: isHorizontal ? 'repeat-x' : 'repeat-y',
				}}
			/>
		</div>
	);
};
