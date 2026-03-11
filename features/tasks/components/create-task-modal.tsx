'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { CreateTaskFormWrapper } from './create-task-form-wrapper';

export const CreateTaskModal = () => {
	const { isOpen, status, close } = useCreateTaskModal();

	return (
		<ResponsiveModal open={isOpen} onOpenChange={(open) => !open && close()}>
			<CreateTaskFormWrapper
				onCancel={close}
				defaultStatus={status ?? undefined}
			/>
		</ResponsiveModal>
	);
};
