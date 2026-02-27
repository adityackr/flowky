'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';

type JoinWorkspaceFormProps = {
	initialValues: {
		name: string;
	};
};

export const JoinWorkspaceForm = ({
	initialValues,
}: JoinWorkspaceFormProps) => {
	const { mutate, isPending } = useJoinWorkspace();
	const inviteCode = useInviteCode();
	const workspaceId = useWorkspaceId();
	const router = useRouter();

	const handleSubmit = () => {
		mutate(
			{
				param: { workspaceId },
				json: { code: inviteCode },
			},
			{
				onSuccess: ({ data }) => {
					router.push(`/workspaces/${data.$id}`);
				},
			},
		);
	};

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader>
				<CardTitle>Join Workspace</CardTitle>
				<CardDescription>
					You&apos;re invited to join the workspace{' '}
					<strong>{initialValues.name}</strong>
				</CardDescription>
			</CardHeader>
			<div className="px-6">
				<DottedSeparator />
			</div>
			<CardContent>
				<div className="flex flex-col gap-2 lg:flex-row  items-center justify-between">
					<Button
						type="button"
						asChild
						className="w-full lg:w-fit"
						size="lg"
						variant="secondary"
						disabled={isPending}
					>
						<Link href="/">Cancel</Link>
					</Button>
					<Button
						className="w-full lg:w-fit"
						size="lg"
						type="button"
						onClick={handleSubmit}
						disabled={isPending}
					>
						Join Workspace
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
