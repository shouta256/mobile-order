// app/(customer)/checkout/page.tsx
"use client";

import CheckoutForm from "./CheckoutForm";
import { placeOrder } from "./actions";

export default function CheckoutPage() {
	return <CheckoutForm placeOrder={placeOrder} />;
}
