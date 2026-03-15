import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type UseGetWorkspaceAnalyticsProps = {
	workspaceId: string;
};

export type WorkspaceAnalyticsResponseType = InferResponseType<
	(typeof client.api.workspaces)[':workspaceId']['analytics']['$get'],
	200
>;

export const useGetWorkspaceAnalytics = ({
	workspaceId,
}: UseGetWorkspaceAnalyticsProps) => {
	const query = useQuery({
		queryKey: ['workspace-analytics', workspaceId],
		queryFn: async () => {
			const res = await client.api.workspaces[':workspaceId']['analytics'].$get(
				{
					param: { workspaceId },
				},
			);

			if (!res.ok) {
				throw new Error('Failed to fetch workspace analytics');
			}

			const { data } = await res.json();

			return data;
		},
	});

	return query;
};
