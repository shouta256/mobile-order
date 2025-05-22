// app/(customer)/checkout/page.tsx

import { getSiteSetting } from "@/lib/settings";
import CheckoutForm from "./CheckoutForm";
import { placeOrder } from "./actions";

export default async function CheckoutPage() {
	const setting = await getSiteSetting();
	const primaryColor = setting?.primaryColor ?? "#000000";
	return <CheckoutForm placeOrder={placeOrder} primaryColor={primaryColor} />;
}
