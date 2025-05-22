// app/(customer)/menu/page.tsx
import { getMenuItems } from "@/lib/menu";
import MenuList from "@/components/menu/MenuList";
import { getSiteSetting } from "@/lib/settings";

export default async function MenuPage() {
	const items = await getMenuItems();
	const setting = await getSiteSetting();
	return (
		<MenuList items={items} primaryColor={setting?.primaryColor ?? "#ff7a00"} />
	);
}
