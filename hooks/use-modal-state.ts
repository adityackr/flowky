import { parseAsBoolean, useQueryState } from 'nuqs';

export const useModalState = (key: string) => {
	const [isOpen, setIsOpen] = useQueryState(
		key,
		parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true }),
	);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	return { isOpen, open, close, setIsOpen };
};
