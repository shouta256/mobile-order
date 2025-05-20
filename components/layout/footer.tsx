import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-6 py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					<div>
						<h3 className="text-lg font-bold mb-4">FoodDelivery</h3>
						<p className="text-gray-400 mb-4">
							Delicious food delivered to your doorstep.
						</p>
						<div className="flex space-x-4">
							<Link
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Facebook size={20} />
							</Link>
							<Link
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Instagram size={20} />
							</Link>
							<Link
								href="#"
								className="text-gray-400 hover:text-white transition-colors"
							>
								<Twitter size={20} />
							</Link>
						</div>
					</div>

					<div>
						<h3 className="text-lg font-bold mb-4">Menu</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/menu"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Browse Menu
								</Link>
							</li>
							<li>
								<Link
									href="/challenges"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Challenges & Promotions
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-bold mb-4">Account</h3>
						<ul className="space-y-2">
							<li>
								<Link
									href="/profile"
									className="text-gray-400 hover:text-white transition-colors"
								>
									My Profile
								</Link>
							</li>
							<li>
								<Link
									href="/orders"
									className="text-gray-400 hover:text-white transition-colors"
								>
									Order History
								</Link>
							</li>
							<li>
								<Link
									href="/cart"
									className="text-gray-400 hover:text-white transition-colors"
								>
									My Cart
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-bold mb-4">Contact</h3>
						<address className="not-italic text-gray-400">
							<p>123 Restaurant Street</p>
							<p>Foodville, FD 12345</p>
							<p className="mt-2">contact@fooddelivery.com</p>
							<p>(123) 456-7890</p>
						</address>
					</div>
				</div>

				<div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-gray-400 text-sm">
						&copy; {currentYear} FoodDelivery. All rights reserved.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<Link
							href="/terms"
							className="text-gray-400 hover:text-white transition-colors text-sm"
						>
							Terms of Service
						</Link>
						<Link
							href="/privacy"
							className="text-gray-400 hover:text-white transition-colors text-sm"
						>
							Privacy Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
