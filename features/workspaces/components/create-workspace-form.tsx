'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateWorkspace } from '../api/use-create-workspace';
import { CreateWorkspaceSchema, createWorkspaceSchema } from '../schemas';

type CreateWorkspaceFormProps = {
	onCancel?: () => void;
};

export const CreateWorkspaceForm: FC<CreateWorkspaceFormProps> = ({
	onCancel,
}) => {
	const { mutate, isPending } = useCreateWorkspace();

	const form = useForm<CreateWorkspaceSchema>({
		resolver: zodResolver(createWorkspaceSchema),
		defaultValues: {
			name: '',
		},
	});

	const handleSubmit = (data: CreateWorkspaceSchema) => {
		mutate({ json: data });
	};

	return (
		<Card className="w-full h-full border-none shadow-none">
			<CardHeader className="flex px-4">
				<CardTitle className="text-xl font-bold">
					Create a new workspace
				</CardTitle>
			</CardHeader>
			<div className="px-4">
				<DottedSeparator />
			</div>

			<CardContent className="px-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="flex flex-col gap-y-4">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Workspace name</FormLabel>
										<FormControl>
											<Input placeholder="Workspace name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DottedSeparator className="py-6" />
						<div className="flex items-center justify-between">
							<Button
								type="button"
								size={'lg'}
								variant="secondary"
								onClick={onCancel}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" size={'lg'} disabled={isPending}>
								Create Workspace
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
