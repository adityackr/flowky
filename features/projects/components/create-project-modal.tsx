'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useModalState } from '@/hooks/use-modal-state';
import { CreateProjectForm } from './create-project-form';

export const CreateProjectModal = () => {
	const { isOpen, setIsOpen, close } = useModalState('create-project');

	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateProjectForm onCancel={close} />
		</ResponsiveModal>
	);
};
