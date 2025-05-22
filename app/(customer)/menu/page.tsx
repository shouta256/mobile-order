// app/(customer)/menu/page.tsx
import { getMenuItems } from "@/lib/menu";
import MenuList from "@/components/menu/MenuList";

export default async function MenuPage() {
	const items = await getMenuItems();
	return <MenuList items={items} />;
}
