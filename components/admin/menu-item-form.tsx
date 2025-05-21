"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Category } from "@prisma/client";
import { ImagePlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@/lib/menu";
import {
	createMenuItem,
	updateMenuItem,
} from "@/app/(admin)/admin/menu/actions";

const formSchema = z.object({
	name: z.string().min(2, {
		message: "Menu item name must be at least 2 characters.",
	}),
	description: z.string().optional(),
	price: z.coerce.number().positive({
		message: "Price must be a positive number.",
	}),
	categoryId: z.string({
		required_error: "Please select a category.",
	}),
	available: z.boolean().default(true),
	featured: z.boolean().default(false),
});

interface MenuItemFormProps {
	categories: Category[];
	item?: MenuItem & { category: Category };
}

export default function MenuItemForm({ categories, item }: MenuItemFormProps) {
	const { toast } = useToast();
	const router = useRouter();
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(
		item?.image || null,
	);
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: item
			? {
					name: item.name,
					description: item.description || "",
					price: Number(item.price),
					categoryId: item.category.id,
					available: item.available,
					featured: item.featured,
				}
			: {
					name: "",
					description: "",
					price: 0,
					categoryId: "",
					available: true,
					featured: false,
				},
	});

	function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	}

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsLoading(true);

		try {
			// Prepare form data including image
			const formData = new FormData();

			// Add all form values
			for (const [key, value] of Object.entries(values)) {
				formData.append(key, String(value));
			}

			// Add image if selected
			if (imageFile) {
				formData.append("image", imageFile);
			}

			// Submit based on whether we're creating or updating
			if (item) {
				formData.append("id", item.id);
				await updateMenuItem(formData);
				toast({
					title: "Menu item updated",
					description: `${values.name} has been updated successfully.`,
				});
			} else {
				await createMenuItem(formData);
				toast({
					title: "Menu item created",
					description: `${values.name} has been added to the menu.`,
				});
				form.reset();
				setImagePreview(null);
			}

			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Card>
			<CardContent className="pt-6">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{/* Image Upload */}
						<div className="space-y-2">
							<FormLabel>Menu Item Image</FormLabel>
							<div className="flex items-center gap-6">
								{imagePreview ? (
									<div className="relative w-32 h-32 rounded-lg overflow-hidden">
										<Image
											src={imagePreview}
											alt="Preview"
											fill
											style={{ objectFit: "cover" }}
										/>
									</div>
								) : (
									<div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
										<ImagePlus className="h-8 w-8 text-gray-400" />
									</div>
								)}
								<div>
									<Input
										id="image"
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										className="max-w-xs"
									/>
									<FormDescription>
										Upload a high-quality image of the menu item.
									</FormDescription>
								</div>
							</div>
						</div>

						{/* Basic Info */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input placeholder="Chicken Burger" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input
												type="number"
												step="0.01"
												placeholder="9.99"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Delicious chicken burger with fresh vegetables and special sauce."
											{...field}
											rows={3}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<FormField
								control={form.control}
								name="available"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Available</FormLabel>
											<FormDescription>
												Make this item available for ordering
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="featured"
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
										<div className="space-y-0.5">
											<FormLabel className="text-base">Featured</FormLabel>
											<FormDescription>
												Highlight this item on the homepage
											</FormDescription>
										</div>
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full md:w-auto"
						>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{item ? "Update Menu Item" : "Create Menu Item"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
