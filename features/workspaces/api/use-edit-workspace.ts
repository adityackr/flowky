import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
	(typeof client.api.workspaces)[':workspaceId']['$patch'],
	200
>;
type RequestType = InferRequestType<
	(typeof client.api.workspaces)[':workspaceId']['$patch']
>;

export const useEditWorkspace = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		mutationFn: async ({ form, param }) => {
			const res = await client.api.workspaces[':workspaceId']['$patch']({
				form,
				param,
			});

			if (!res.ok) {
				throw new Error('Failed to update workspace');
			}

			return await res.json();
		},
		onSuccess: ({ data }) => {
			toast.success('Workspace updated successfully');
			queryClient.invalidateQueries({ queryKey: ['workspaces'] });
			queryClient.invalidateQueries({
				queryKey: ['workspaces', data.$id],
			});
		},
		onError: () => {
			toast.error('Failed to update workspace');
		},
	});

	return mutation;
};
