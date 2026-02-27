import { getCurrent } from '@/features/auth/queries';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';

import { redirect } from 'next/navigation';

type Props = {
	params: Promise<{ workspaceId: string }>;
};

const JoinWorkspacePage = async ({ params }: Props) => {
	const { workspaceId } = await params;

	const user = await getCurrent();

	if (!user) {
		redirect('/sign-in');
	}

	const workspace = await getWorkspaceInfo({ workspaceId });

	if (!workspace) {
		redirect('/');
	}

	return (
		<div className="w-full lg:max-w-xl">
			<JoinWorkspaceForm initialValues={{ name: workspace.name }} />
		</div>
	);
};

export default JoinWorkspacePage;
