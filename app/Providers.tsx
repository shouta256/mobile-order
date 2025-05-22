"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { CartProvider } from "@/hooks/useCart";
import { ToasterProvider } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/toaster";

interface ProvidersProps {
	children: ReactNode;
	session: Session | null;
}

export default function Providers({ children, session }: ProvidersProps) {
	return (
		<SessionProvider
			session={session}
			// 60秒ごとにセッション情報を再フェッチ
			refetchInterval={60}
			refetchOnWindowFocus={true}
		>
			<CartProvider>
				<ToasterProvider>
					{children}
					<Toaster />
				</ToasterProvider>
			</CartProvider>
		</SessionProvider>
	);
}
