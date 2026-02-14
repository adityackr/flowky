import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all disabled:pointer-events-none disabled:bg-neutral-100 disabled:from-neutral-100 disabled:to-neutral-100 disabled:text-neutral-400 border border-neutral-200 shadow-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
	{
		variants: {
			variant: {
				primary:
					'bg-linear-to-b from-blue-600 to-blue-700 text-primary-foreground hover:from-blue-700 hover:to-blue-700',
				destructive:
					'bg-linear-to-b from-amber-600 to-amber-700 text-primary-foreground hover:from-amber-700 hover:to-amber-700',
				outline:
					'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
				secondary: 'bg-white text-black hover:bg-neutral-100',
				ghost:
					'border-transparent shadow-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
				muted: 'bg-neutral-200 text-neutral-600 hover:bg-neutral-200/80',
				tertiary:
					'bg-blue-100 text-blue-600 hover:bg-blue-200 border-transparent shadow-none',
			},
			size: {
				default: 'h-10 px-4 py-2 has-[>svg]:px-3',
				xs: "h-7 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
				lg: 'h-12 rounded-md px-6 has-[>svg]:px-4',
				icon: 'size-10',
				'icon-xs': "size-7 rounded-md [&_svg:not([class*='size-'])]:size-3",
				'icon-sm': 'size-8',
				'icon-lg': 'size-12',
			},
		},
		defaultVariants: {
			variant: 'primary',
			size: 'default',
		},
	},
);

function Button({
	className,
	variant = 'primary',
	size = 'default',
	asChild = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : 'button';

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
