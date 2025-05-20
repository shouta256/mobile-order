// app/(customer)/menu/page.tsx
import Image from "next/image";
import { notFound } from "next/navigation";
import { getMenuItems } from "@/lib/menu";
import MenuList from "@/components/menu/menu-list";

interface MenuItemPageProps {
	params: { id: string };
}

export default async function MenuPage() {
	const items = await getMenuItems();
	return <MenuList items={items} />;
}
