import { EntityAvatar } from '@/components/entity-avatar';
import { Button } from '@/components/ui/button';
import { getCurrent } from '@/features/auth/queries';
import { getProject } from '@/features/projects/queries';
import { PencilIcon } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

type ProjectPageProps = {
	params: Promise<{
		projectId: string;
	}>;
};

const ProjectPage = async ({ params }: ProjectPageProps) => {
	const user = await getCurrent();
	const { projectId } = await params;

	if (!user) {
		redirect('/sign-in');
	}

	const project = await getProject({ projectId });

	if (!project) {
		throw new Error('Project not found');
	}

	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-2">
					<EntityAvatar
						name={project.name}
						image={project.imageUrl}
						className="size-8"
					/>
					<p className="text-lg font-semibold">{project.name}</p>
				</div>

				<div>
					<Button variant={'secondary'} size="sm" asChild>
						<Link
							href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}
						>
							<PencilIcon className="size-4" />
							Edit Project
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProjectPage;
