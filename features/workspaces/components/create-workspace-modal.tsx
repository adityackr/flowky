'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useModalState } from '@/hooks/use-modal-state';
import { CreateWorkspaceForm } from './create-workspace-form';

export const CreateWorkspaceModal = () => {
	const { isOpen, setIsOpen, close } = useModalState('create-workspace');

	return (
		<ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
			<CreateWorkspaceForm onCancel={close} />
		</ResponsiveModal>
	);
};
