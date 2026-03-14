import { Loader2 } from 'lucide-react';

export const PageLoader = () => {
	return (
		<div className="flex items-center justify-center h-screen">
			<Loader2 className="animate-spin size-6 text-muted-foreground" />
		</div>
	);
};
