"use client";

import { useRouter, usePathname } from "next/navigation";
import type { Category } from "@prisma/client";

interface CategoryTabsProps {
	categories: Category[];
	activeCategory?: string;
	searchQuery?: string;
}

export default function CategoryTabs({
	categories,
	activeCategory,
	searchQuery,
}: CategoryTabsProps) {
	const router = useRouter();
	const pathname = usePathname();

	const handleCategoryChange = (categoryId: string | null) => {
		const params = new URLSearchParams();

		if (categoryId) {
			params.set("category", categoryId);
		}

		if (searchQuery) {
			params.set("search", searchQuery);
		}

		router.push(`${pathname}?${params.toString()}`);
	};

	return (
		<div className="mb-8">
			<div className="border-b border-gray-200 overflow-x-auto pb-1 no-scrollbar">
				<div className="flex space-x-2 min-w-max">
					<button
						onClick={() => handleCategoryChange(null)}
						className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
							!activeCategory ? "bg-orange-500 text-white" : "hover:bg-gray-100"
						}`}
					>
						All
					</button>

					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryChange(category.id)}
							className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
								activeCategory === category.id
									? "bg-orange-500 text-white"
									: "hover:bg-gray-100"
							}`}
						>
							{category.name}
						</button>
					))}
				</div>
			</div>
		</div>
	);
}
