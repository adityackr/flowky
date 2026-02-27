'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useConfirm } from '@/hooks/use-confirm';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react/jsx-runtime';
import { useDeleteMember } from '../api/use-delete-member';
import { useGetMembers } from '../api/use-get-members';
import { useUpdateMember } from '../api/use-update-member';
import { MemberRole } from '../types';
import { MemberAvatar } from './member-avatar';

export const MembersList = () => {
	const workspaceId = useWorkspaceId();
	const [ConfirmDialog, confirm] = useConfirm(
		'Remove Member',
		'Are you sure you want to remove this member?',
		'destructive',
	);

	const { data: members } = useGetMembers({ workspaceId });
	const { mutate: deleteMember, isPending: isDeletingMember } =
		useDeleteMember();
	const { mutate: updateMember, isPending: isUpdatingMember } =
		useUpdateMember();

	const handleUpdateMember = (memberId: string, role: MemberRole) => {
		updateMember({ json: { role }, param: { memberId } });
	};

	const handleDeleteMember = async (memberId: string) => {
		const ok = await confirm();
		if (!ok) return;
		deleteMember(
			{ param: { memberId } },
			{
				onSuccess: () => {
					window.location.reload();
				},
			},
		);
	};

	return (
		<Card className="border-none shadow-none">
			<ConfirmDialog />
			<CardHeader className="flex flex-row gap-x-4 items-center space-y-0">
				<Button asChild variant={'secondary'} size={'sm'}>
					<Link href={`/workspaces/${workspaceId}`}>
						<ArrowLeftIcon className="size-4" />
						Back
					</Link>
				</Button>
				<CardTitle>Members</CardTitle>
			</CardHeader>

			<DottedSeparator className="px-6" />

			<CardContent>
				{members?.rows.map((member, index) => (
					<Fragment key={member.$id}>
						<div className="flex items-center gap-2">
							<MemberAvatar
								className="size-10"
								fallbackClassName="text-lg"
								name={member.name}
							/>

							<div className="flex flex-col">
								<p className="text-sm font-medium">{member.name}</p>
								<p className="text-xs text-muted-foreground">{member.email}</p>
							</div>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant={'secondary'}
										size={'icon'}
										className="ml-auto"
									>
										<MoreVerticalIcon className="size-4 text-muted-foreground" />
									</Button>
								</DropdownMenuTrigger>

								<DropdownMenuContent side="bottom" align="end">
									<DropdownMenuItem
										className="font-medium"
										onClick={() =>
											handleUpdateMember(member.$id, MemberRole.ADMIN)
										}
										disabled={isUpdatingMember}
									>
										Set as Administrator
									</DropdownMenuItem>
									<DropdownMenuItem
										className="font-medium "
										onClick={() =>
											handleUpdateMember(member.$id, MemberRole.MEMBER)
										}
										disabled={isUpdatingMember}
									>
										Set as Member
									</DropdownMenuItem>
									<DropdownMenuItem
										className="font-medium text-amber-700"
										onClick={() => handleDeleteMember(member.$id)}
										disabled={isDeletingMember}
									>
										Remove {member.name}
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{index < members?.rows.length - 1 && (
							<Separator className="my-2.5" />
						)}
					</Fragment>
				))}
			</CardContent>
		</Card>
	);
};
