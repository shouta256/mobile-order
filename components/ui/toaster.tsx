// components/ui/Toaster.tsx
"use client";

import React from "react";
import {
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
} from "./toast"; // We assume Radix UI base
import { useToast } from "@/hooks/useToast";

export function Toaster() {
	const { toasts, removeToast } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, variant }) => (
				<Toast
					key={id}
					open
					onOpenChange={(open) => {
						if (!open) removeToast(id);
					}}
					variant={variant}
				>
					<div className="grid gap-1">
						<ToastTitle>{title}</ToastTitle>
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					<ToastClose />
				</Toast>
			))}
			<ToastViewport />
		</ToastProvider>
	);
}
