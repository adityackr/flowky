import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export const useLogout = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error>({
		mutationFn: async () => {
			const res = await client.api.auth.logout['$post']();
			return await res.json();
		},
		onSuccess: () => {
			toast.success('Logged out successfully');
			router.refresh();
			queryClient.invalidateQueries({ queryKey: ['current'] });
		},
		onError: () => {
			toast.error('Failed to log out');
		},
	});

	return mutation;
};
