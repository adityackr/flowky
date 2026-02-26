import { ResponsiveModal } from '@/components/responsive-modal';
import { Button, type ButtonProps } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { JSX, useState } from 'react';

export const useConfirm = (
	title: string,
	message: string,
	variant: ButtonProps['variant'] = 'primary',
): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () => {
		return new Promise<boolean>((resolve) => {
			setPromise({ resolve });
		});
	};

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmationDialog = () => {
		return (
			<ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
				<Card className="size-full border-none shadow-none">
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{message}</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="w-full flex flex-col gap-y-2 lg:flex-row lg:gap-x-2 items-center justify-end">
							<Button
								variant="outline"
								onClick={handleCancel}
								className="w-full lg:w-auto"
							>
								Cancel
							</Button>
							<Button
								variant={variant}
								onClick={handleConfirm}
								className="w-full lg:w-auto"
							>
								Confirm
							</Button>
						</div>
					</CardContent>
				</Card>
			</ResponsiveModal>
		);
	};

	return [ConfirmationDialog, confirm];
};
