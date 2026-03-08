'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useModalState } from '@/hooks/use-modal-state';
import { CreateTaskFormWrapper } from './create-task-form-wrapper';

export const CreateTaskModal = () => {
	const { isOpen, setIsOpen, close } = useModalState('create-task');

	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateTaskFormWrapper onCancel={close} />
		</ResponsiveModal>
	);
};
