'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDeleteProject } from '../api/use-delete-project';
import { useUpdateProject } from '../api/use-update-project';
import { updateProjectSchema, type UpdateProjectSchema } from '../schemas';
import type { Project } from '../types';

type EditProjectFormProps = {
	onCancel?: () => void;
	initialValues: Project;
};

export const EditProjectForm: FC<EditProjectFormProps> = ({
	onCancel,
	initialValues,
}) => {
	const router = useRouter();
	const { mutate, isPending } = useUpdateProject();
	const { mutate: deleteProject, isPending: isProjectDeleting } =
		useDeleteProject();

	const [DeleteDialog, confirmDelete] = useConfirm(
		'Delete project',
		'Are you sure you want to delete this project?',
		'destructive',
	);

	const inputRef = useRef<HTMLInputElement>(null);

	const form = useForm<UpdateProjectSchema>({
		resolver: zodResolver(updateProjectSchema),
		defaultValues: {
			...initialValues,
			image: initialValues.imageUrl ?? '',
		},
	});

	const handleDelete = async () => {
		const ok = await confirmDelete();
		if (!ok) return;

		deleteProject({ param: { projectId: initialValues.$id } });
	};

	const handleSubmit = (data: UpdateProjectSchema) => {
		const finalData = {
			...data,
			image: data.image instanceof File ? data.image : (data.image ?? ''),
		};

		mutate(
			{ form: finalData, param: { projectId: initialValues.$id } },
			{
				onSuccess: ({ data }) => {
					form.reset({
						...data,
						image: data.imageUrl ?? '',
					});
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
		<div className="flex flex-col gap-y-4">
			<DeleteDialog />
			<Card className="w-full h-full border-none shadow-none">
				<CardHeader className="flex flex-row items-center gap-x-4 space-y-0 px-4">
					<Button
						size="sm"
						variant={'secondary'}
						onClick={
							onCancel
								? onCancel
								: () =>
										router.push(
											`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`,
										)
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
											<FormLabel>Project name</FormLabel>
											<FormControl>
												<Input placeholder="Project name" {...field} />
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
															alt="Project image"
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
																field.onChange('');
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

			<Card className="w-full h-full border-none shadow-none">
				<CardHeader>
					<CardTitle>Danger Zone</CardTitle>
					<CardDescription>
						Deleting your project will permanently remove all of your data.
					</CardDescription>
				</CardHeader>
				<DottedSeparator className="px-6" />
				<CardContent className="flex items-center justify-end">
					<Button
						type="button"
						size={'sm'}
						variant="destructive"
						disabled={isPending || isProjectDeleting}
						onClick={handleDelete}
					>
						Delete Project
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};
