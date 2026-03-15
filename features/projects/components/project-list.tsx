import { DottedSeparator } from '@/components/dotted-separator';
import { EntityAvatar } from '@/components/entity-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useModalState } from '@/hooks/use-modal-state';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Project } from '../types';

interface ProjectListProps {
	projects: Project[];
	total: number;
}

export const ProjectList = ({ projects, total }: ProjectListProps) => {
	const workspaceId = useWorkspaceId();
	const { open: isCreateProjectModalOpen } = useModalState('create-project');

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-white border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Projects ({total})</p>
					<Button
						variant={'secondary'}
						size={'icon'}
						onClick={isCreateProjectModalOpen}
					>
						<PlusIcon className="size-4 text-neutral-500" />
					</Button>
				</div>

				<DottedSeparator className="my-4" />

				<ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{projects.map((project) => (
						<li key={project.$id}>
							<Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
								<Card className="shadow-none rounded-lg hover:opacity-75 transition">
									<CardContent className="flex items-center gap-x-2.5">
										<EntityAvatar
											name={project.name}
											image={project.imageUrl}
											className="size-12"
											fallbackClassName="text-lg"
										/>
										<p className="text-lg truncate font-medium">
											{project.name}
										</p>
									</CardContent>
								</Card>
							</Link>
						</li>
					))}

					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No projects found
					</li>
				</ul>
			</div>
		</div>
	);
};
