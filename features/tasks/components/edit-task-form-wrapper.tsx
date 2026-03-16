'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Loader2 } from 'lucide-react';
import { useGetTask } from '../api/use-get-task';
import { EditTaskForm } from './edit-task-form';

interface EditTaskFormWrapperProps {
	onCancel: () => void;
	id: string;
}

export const EditTaskFormWrapper = ({
	onCancel,
	id,
}: EditTaskFormWrapperProps) => {
	const workspaceId = useWorkspaceId();

	const { data: initialValues, isLoading: isTaskLoading } = useGetTask({
		taskId: id,
	});

	const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
		workspaceId,
	});

	const { data: members, isLoading: isMembersLoading } = useGetMembers({
		workspaceId,
	});

	const projectOptions = projects?.rows.map((project) => ({
		id: project.$id,
		name: project.name,
		imageUrl: project.imageUrl,
	}));

	const memberOptions = members?.rows.map((member) => ({
		id: member.$id,
		name: member.name,
	}));

	const isLoading = isProjectsLoading || isMembersLoading || isTaskLoading;

	if (isLoading) {
		return (
			<Card className="w-full h-178.5 border-none shadow-none">
				<CardContent className="flex items-center justify-center h-full">
					<Loader2 className="size-5 animate-spin text-muted-foreground" />
				</CardContent>
			</Card>
		);
	}

	if (!initialValues) {
		return null;
	}

	return (
		<EditTaskForm
			onCancel={onCancel}
			projectOptions={projectOptions ?? []}
			memberOptions={memberOptions ?? []}
			initialValues={initialValues}
		/>
	);
};
