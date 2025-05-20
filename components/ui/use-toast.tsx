// components/ui/use-toast.tsx
"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import {
	ToastProvider,
	ToastViewport,
	Toast,
	ToastTitle,
	ToastDescription,
	ToastClose,
} from "./toast";

type ToastData = {
	id: string;
	title: string;
	description?: string;
	variant?: "default" | "destructive";
};

type ToastContextType = {
	/** トーストを発火させる */
	toast: (opts: {
		title: string;
		description?: string;
		variant?: "default" | "destructive";
	}) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	// トーストを追加
	const toast = useCallback(
		(opts: {
			title: string;
			description?: string;
			variant?: "default" | "destructive";
		}) => {
			const id = crypto.randomUUID();
			setToasts((prev) => [...prev, { id, ...opts }]);
		},
		[],
	);

	// トーストを消す
	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast }}>
			{/* Radix Provider */}
			<ToastProvider>
				{children}
				<ToastViewport>
					{toasts.map(({ id, title, description, variant }) => (
						<Toast
							key={id}
							open
							onOpenChange={(open) => {
								if (!open) removeToast(id);
							}}
							variant={variant}
						>
							<ToastTitle>{title}</ToastTitle>
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
							<ToastClose />
						</Toast>
					))}
				</ToastViewport>
			</ToastProvider>
		</ToastContext.Provider>
	);
}

/** トーストを発火させるためのフック */
export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) {
		throw new Error("useToast must be used within ToasterProvider");
	}
	return ctx;
}
