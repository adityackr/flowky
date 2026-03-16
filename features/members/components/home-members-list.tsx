import { DottedSeparator } from '@/components/dotted-separator';
import { EntityAvatar } from '@/components/entity-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { Member } from '../types';

interface HomeMembersListProps {
	members: Member[];
	total: number;
}

export const HomeMembersList = ({ members, total }: HomeMembersListProps) => {
	const workspaceId = useWorkspaceId();

	return (
		<div className="flex flex-col gap-y-4 col-span-1">
			<div className="bg-white border rounded-lg p-4">
				<div className="flex items-center justify-between">
					<p className="text-lg font-semibold">Members ({total})</p>
					<Button variant={'secondary'} size={'icon'} asChild>
						<Link href={`/workspaces/${workspaceId}/members`}>
							<SettingsIcon className="size-4 text-neutral-500" />
						</Link>
					</Button>
				</div>

				<DottedSeparator className="my-4" />

				<ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{members.map((member) => (
						<li key={member.$id}>
							<Card className="shadow-none rounded-lg overflow-hidden">
								<CardContent className="flex flex-col items-center gap-y-2">
									<EntityAvatar
										name={member.name}
										className="size-12"
										fallbackClassName="text-lg bg-neutral-300 rounded-full text-neutral-700"
									/>
									<div className="flex flex-col items-center overflow-hidden">
										<p className="text-lg line-clamp-1 font-medium">
											{member.name}
										</p>
										<p className="text-sm line-clamp-1 text-muted-foreground">
											{member.email}
										</p>
									</div>
								</CardContent>
							</Card>
						</li>
					))}

					<li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
						No members found
					</li>
				</ul>
			</div>
		</div>
	);
};
