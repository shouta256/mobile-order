// hooks/use-toast.tsx
"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	type ReactNode,
	type ReactElement,
} from "react";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastOptions {
	title: string;
	description?: string;
	variant?: ToastVariant;
}

export interface ToastData extends ToastOptions {
	id: string;
}

interface ToastContextType {
	toasts: ToastData[];
	toast: (opts: ToastOptions) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToasterProvider({
	children,
}: { children: ReactNode }): ReactElement {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const toast = useCallback(
		(opts: ToastOptions) => {
			const id = crypto.randomUUID();
			setToasts((prev) => [...prev, { id, ...opts }]);
			// 自動で消す場合はここでタイマーをセット
			setTimeout(() => removeToast(id), 5000);
		},
		[removeToast],
	);

	return (
		<ToastContext.Provider value={{ toasts, toast, removeToast }}>
			{children}
		</ToastContext.Provider>
	);
}

export function useToast() {
	const ctx = useContext(ToastContext);
	if (!ctx) throw new Error("useToast must be used within ToasterProvider");
	return ctx;
}
