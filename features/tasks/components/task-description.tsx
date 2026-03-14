import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useUpdateTask } from '../api/use-update-task';
import { Task } from '../types';

interface TaskDescriptionProps {
	task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [description, setDescription] = useState(task.description);

	const { mutate, isPending } = useUpdateTask();

	const handleSave = () => {
		mutate(
			{
				json: {
					description,
				},
				param: {
					taskId: task.$id,
				},
			},
			{
				onSuccess: () => {
					setIsEditing(false);
				},
			},
		);
	};

	return (
		<div className="p-4 border rounded-lg">
			<div className="flex items-center justify-between">
				<p className="text-lg font-semibold">Description</p>

				<Button
					size="sm"
					variant="secondary"
					onClick={() => setIsEditing((prev) => !prev)}
				>
					{isEditing ? (
						<>
							<XIcon className="size-4" />
							Cancel
						</>
					) : (
						<>
							<PencilIcon className="size-4" />
							Edit
						</>
					)}
				</Button>
			</div>

			<DottedSeparator className="my-4" />

			{isEditing ? (
				<div className="flex flex-col gap-y-4">
					<Textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={4}
						placeholder="Enter description"
						disabled={isPending}
					/>

					<Button
						onClick={handleSave}
						disabled={isPending}
						size="sm"
						className="w-fit ml-auto"
					>
						{isPending ? 'Saving...' : 'Save'}
					</Button>
				</div>
			) : (
				<div>
					{task.description || (
						<span className="text-muted-foreground">No description</span>
					)}
				</div>
			)}
		</div>
	);
};
