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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useEditWorkspace } from '../api/use-edit-workspace';
import { editWorkspaceSchema, EditWorkspaceSchema } from '../schemas';
import type { Workspace } from '../types';

type EditWorkspaceFormProps = {
	onCancel?: () => void;
	initialValues: Workspace;
};

export const EditWorkspaceForm: FC<EditWorkspaceFormProps> = ({
	onCancel,
	initialValues,
}) => {
	const router = useRouter();
	const { mutate, isPending } = useEditWorkspace();

	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<EditWorkspaceSchema>({
		resolver: zodResolver(editWorkspaceSchema),
		defaultValues: {
			...initialValues,
			image: initialValues.imageUrl ?? '',
		},
	});

	const handleSubmit = (data: EditWorkspaceSchema) => {
		const finalData = {
			...data,
			image: data.image instanceof File ? data.image : '',
		};

		mutate(
			{ form: finalData, param: { workspaceId: initialValues.$id } },
			{
				onSuccess: ({ data }) => {
					form.reset();
					router.push(`/workspaces/${data.$id}`);
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
			<CardHeader className="flex flex-row items-center gap-x-4 space-y-0 px-4">
				<Button
					size="sm"
					variant={'secondary'}
					onClick={
						onCancel
							? onCancel
							: () => router.push(`/workspaces/${initialValues.$id}`)
					}
				>
					<ArrowLeftIcon />
					Back
				</Button>
				<CardTitle className="text-xl font-bold">
					{initialValues.name}
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
												{!field.value ? (
													<Button
														type="button"
														variant="tertiary"
														size="xs"
														onClick={() => inputRef.current?.click()}
														disabled={isPending}
														className="mt-2"
													>
														Upload Image
													</Button>
												) : (
													<Button
														type="button"
														variant="destructive"
														size="xs"
														onClick={() => {
															field.onChange(null);
															if (inputRef.current) {
																inputRef.current.value = '';
															}
														}}
														disabled={isPending}
														className="mt-2"
													>
														Remove Image
													</Button>
												)}
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
								className={cn(!onCancel && 'invisible')}
							>
								Cancel
							</Button>
							<Button type="submit" size={'lg'} disabled={isPending}>
								Save Changes
							</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};
