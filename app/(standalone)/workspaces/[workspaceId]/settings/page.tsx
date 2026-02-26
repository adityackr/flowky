import { getCurrent } from '@/features/auth/queries';
import { EditWorkspaceForm } from '@/features/workspaces/components/edit-workspace-form';
import { getWorkspace } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

type SettingsPageProps = {
	params: Promise<{ workspaceId: string }>;
};

const SettingsPage = async ({ params }: SettingsPageProps) => {
	const user = await getCurrent();
	if (!user) redirect('/sign-in');

	const { workspaceId } = await params;

	const workspace = await getWorkspace({ workspaceId });

	if (!workspace) redirect(`/workspaces/${workspaceId}`);

	// Appwrite SDK returns class instances — serialize to a plain object
	// so it can be safely passed to Client Components across the RSC boundary.
	const initialValues = JSON.parse(JSON.stringify(workspace));

	return (
		<div className="w-full lg:max-w-xl">
			<EditWorkspaceForm initialValues={initialValues} />
		</div>
	);
};

export default SettingsPage;
