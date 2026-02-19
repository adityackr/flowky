'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
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
import { useRegister } from '../api/use-register';
import { SignUpSchema, signUpSchema } from '../schemas';

export const SignUpCard = () => {
	const { mutate, isPending } = useRegister();
	const form = useForm<SignUpSchema>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: SignUpSchema) => {
		mutate({
			json: data,
		});
	};

	return (
		<Card className="w-full h-full md:w-[486px] border-none shadow-none">
			<CardHeader className="text-center p-4">
				<CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
				<CardDescription>
					By signing up, you agree to our{' '}
					<Link href="/terms" className="text-blue-700">
						Terms of Service
					</Link>{' '}
					and{' '}
					<Link href="/privacy" className="text-blue-700">
						Privacy Policy
					</Link>
				</CardDescription>
			</CardHeader>
			<div className="px-4">
				<DottedSeparator />
			</div>
			<CardContent className="p-4">
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name="name"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											type="text"
											placeholder="Enter your name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
							Sign Up
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
					Continue with Google
				</Button>
				<Button
					disabled={isPending}
					variant={'secondary'}
					size="lg"
					className="w-full"
				>
					<FaGithub className="mr-2 size-5" />
					Continue with GitHub
				</Button>
			</CardContent>
			<div className="px-4">
				<DottedSeparator />
			</div>
			<CardContent className="p-4 flex items-center justify-center">
				<p>
					Already have an account?{' '}
					<Link href="/sign-in" className="text-blue-700">
						Sign In
					</Link>
				</p>
			</CardContent>
		</Card>
	);
};
