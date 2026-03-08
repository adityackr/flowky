import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type DatePickerProps = {
	value: Date | undefined;
	onChange: (value: Date) => void;
	className?: string;
	placeholder?: string;
};

export const DatePicker = ({
	value,
	onChange,
	className,
	placeholder,
}: DatePickerProps) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={'outline'}
					size={'lg'}
					className={cn(
						'w-full justify-start text-left font-normal px-3',
						!value && 'text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon />
					{value ? format(value, 'PPP') : <span>{placeholder}</span>}
				</Button>
			</PopoverTrigger>

			<PopoverContent>
				<Calendar
					mode="single"
					selected={value}
					defaultMonth={value}
					onSelect={(date) => onChange(date as Date)}
				/>
			</PopoverContent>
		</Popover>
	);
};
