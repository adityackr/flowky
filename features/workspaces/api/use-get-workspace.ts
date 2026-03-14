import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

export const useGetWorkspace = ({ workspaceId }: { workspaceId: string }) => {
	const query = useQuery({
		queryKey: ['workspace', workspaceId],
		queryFn: async () => {
			const res = await client.api.workspaces[':workspaceId'].$get({
				param: { workspaceId },
			});

			if (!res.ok) {
				throw new Error('Failed to fetch workspace');
			}

			const { data } = await res.json();

			return data;
		},
	});

	return query;
};
