import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
	(typeof client.api.projects)['$post'],
	200
>;
type RequestType = InferRequestType<(typeof client.api.projects)['$post']>;

export const useCreateProject = () => {
	const queryClient = useQueryClient();
	const router = useRouter();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form }) => {
			const res = await client.api.projects['$post']({
				form,
			});

			if (!res.ok) {
				throw new Error('Failed to create project');
			}

			return await res.json();
		},
		onSuccess: ({ data }) => {
			toast.success('Project created successfully');
			queryClient.invalidateQueries({ queryKey: ['projects'] });
			router.push(`/workspaces/${data.workspaceId}/projects/${data.$id}`);
		},
		onError: () => {
			toast.error('Failed to create project');
		},
	});

	return mutation;
};
