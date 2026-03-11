import { parseAsBoolean, parseAsStringEnum, useQueryStates } from 'nuqs';
import { TaskStatus } from '../types';

export const useCreateTaskModal = () => {
	const [{ 'create-task': isOpen, 'create-task-status': status }, setParams] =
		useQueryStates({
			'create-task': parseAsBoolean.withDefault(false).withOptions({
				clearOnDefault: true,
			}),
			'create-task-status': parseAsStringEnum<TaskStatus>(
				Object.values(TaskStatus),
			).withOptions({ clearOnDefault: true }),
		});

	const open = (defaultStatus?: TaskStatus) =>
		setParams({
			'create-task': true,
			'create-task-status': defaultStatus ?? null,
		});

	const close = () =>
		setParams({ 'create-task': false, 'create-task-status': null });

	return {
		isOpen,
		status,
		open,
		close,
		setIsOpen: (v: boolean) => setParams({ 'create-task': v }),
	};
};
