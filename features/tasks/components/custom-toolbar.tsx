import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

type CustomToolbarProps = {
	date: Date;
	onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
};

export const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
	return (
		<div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
			<Button
				variant="secondary"
				size="icon-sm"
				className="flex items-center"
				onClick={() => onNavigate('PREV')}
			>
				<ChevronLeft className="size-4" />
			</Button>
			<div className="flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto">
				<CalendarIcon className="size-4 mr-1" />
				<p className="text-sm font-medium">{format(date, 'MMMM yyyy')}</p>
			</div>
			<Button
				variant="secondary"
				size="icon-sm"
				className="flex items-center"
				onClick={() => onNavigate('NEXT')}
			>
				<ChevronRight className="size-4" />
			</Button>
		</div>
	);
};
