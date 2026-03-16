'use server';

import { createAdminClient } from '@/lib/appwrite';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { OAuthProvider } from 'node-appwrite';

export async function signUpWithGithub() {
	const { account } = await createAdminClient();

	const origin = (await headers()).get('origin');

	const redirectUrl = await account.createOAuth2Token({
		provider: OAuthProvider.Github,
		success: `${origin}/oauth`,
		failure: `${origin}/sign-up`,
	});

	return redirect(redirectUrl);
}

export async function signUpWithGoogle() {
	const { account } = await createAdminClient();

	const origin = (await headers()).get('origin');

	const redirectUrl = await account.createOAuth2Token({
		provider: OAuthProvider.Google,
		success: `${origin}/oauth`,
		failure: `${origin}/sign-up`,
	});

	return redirect(redirectUrl);
}
