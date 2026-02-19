'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useLogin } from '../api/use-login';
import { LoginSchema, loginSchema } from '../schemas';

export const SignInCard = () => {
	const { mutate, isPending } = useLogin();
	const form = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: LoginSchema) => {
		mutate({
			json: data,
		});
	};

	return (
		<Card className="w-full h-full md:w-[486px] border-none shadow-none">
			<CardHeader className="flex items-center justify-center text-center p-4">
				<CardTitle className="text-2xl font-semibold">Welcome Back!</CardTitle>
			</CardHeader>
			<div className="px-4">
				<DottedSeparator />
			</div>
			<CardContent className="p-4">
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="email"
											placeholder="Enter email address"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="password"
											placeholder="Enter password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							className="w-full"
							size="lg"
							type="submit"
							disabled={isPending}
						>
							Login
						</Button>
					</form>
				</Form>
			</CardContent>
			<div className="px-4">
				<DottedSeparator />
			</div>

			<CardContent className="p-4 flex flex-col gap-y-4">
				<Button
					disabled={isPending}
					variant={'secondary'}
					size="lg"
					className="w-full"
				>
					<FcGoogle className="mr-2 size-5" />
					Login with Google
				</Button>
				<Button
					disabled={isPending}
					variant={'secondary'}
					size="lg"
					className="w-full"
				>
					<FaGithub className="mr-2 size-5" />
					Login with GitHub
				</Button>
			</CardContent>
			<div className="px-4">
				<DottedSeparator />
			</div>
			<CardContent className="p-4 flex items-center justify-center">
				<p>
					Don&apos;t have an account?{' '}
					<Link href="/sign-up" className="text-blue-700">
						Sign Up
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
