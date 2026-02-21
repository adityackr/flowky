'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FC, useRef } from 'react';
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

	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<CreateWorkspaceSchema>({
		resolver: zodResolver(createWorkspaceSchema),
		defaultValues: {
			name: '',
		},
	});

	const handleSubmit = (data: CreateWorkspaceSchema) => {
		const finalData = {
			...data,
			image: data.image instanceof File ? data.image : '',
		};

		mutate(
			{ form: finalData },
			{
				onSuccess: () => {
					form.reset();
					// TODO: Redirect to new workspace
				},
			},
		);
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			form.setValue('image', file);
		}
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

							<FormField
								control={form.control}
								name="image"
								render={({ field }) => (
									<div className="flex flex-col gap-y-2">
										<div className="flex items-center gap-x-5">
											{field.value ? (
												<div className="size-[72px] relative rounded-md overflow-hidden">
													<Image
														src={
															field.value instanceof File
																? URL.createObjectURL(field.value)
																: field.value
														}
														alt="Workspace image"
														fill
														className="object-cover"
													/>
												</div>
											) : (
												<Avatar className="size-[72px]">
													<AvatarFallback>
														<ImageIcon className="size-[36px] text-neutral-400" />
													</AvatarFallback>
												</Avatar>
											)}

											<div className="flex flex-col">
												<p className="text-sm">Workspace Icon</p>
												<p className="text-sm text-muted-foreground">
													JPG, PNG, SVG, JPEG or webp, max 1mb
												</p>
												<input
													type="file"
													className="hidden"
													ref={inputRef}
													accept=".jpg, .png, .svg, .jpeg, .webp"
													disabled={isPending}
													onChange={handleImageChange}
												/>
												<Button
													type="button"
													variant="tertiary"
													size="xs"
													onClick={() => inputRef.current?.click()}
													disabled={isPending}
													className="mt-2"
												>
													{field.value ? 'Change Image' : 'Upload Image'}
												</Button>
											</div>
										</div>
									</div>
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
