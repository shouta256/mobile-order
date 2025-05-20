"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/hooks/use-cart";
import { ToasterProvider } from "@/components/ui/use-toast";

interface ProvidersProps {
	children: ReactNode;
	session: any;
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
				<ToasterProvider>{children}</ToasterProvider>
			</CartProvider>
		</SessionProvider>
	);
}
