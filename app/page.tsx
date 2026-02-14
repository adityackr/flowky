import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const HomePage = () => {
	return (
		<div className="flex items-center gap-4 flex-wrap">
			<Button disabled>Primary</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="muted">Muted</Button>
			<Button variant="tertiary">Tertiary</Button>
			<Button variant="destructive">Destructive</Button>
			<Input />
		</div>
	);
};

export default HomePage;
