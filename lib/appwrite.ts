import 'server-only';

import { AUTH_COOKIE } from '@/features/auth/constants';
import { cookies } from 'next/headers';
import { Account, Client, TablesDB } from 'node-appwrite';

export const createSessionClient = async () => {
	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

	const session = (await cookies()).get(AUTH_COOKIE);

	if (!session || !session.value) {
		throw new Error('Unauthorized');
	}

	client.setSession(session.value);

	return {
		get account() {
			return new Account(client);
		},
		get tablesDB() {
			return new TablesDB(client);
		},
	};
};

export const createAdminClient = () => {
	const client = new Client()
		.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
		.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
		.setKey(process.env.NEXT_APPWRITE_KEY!);

	return {
		get account() {
			return new Account(client);
		},
	};
};
