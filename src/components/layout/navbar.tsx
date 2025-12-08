import Link from "next/link";

export function Navbar() {
	return (
		<nav className="border-b bg-white dark:bg-gray-950">
			<div className="container mx-auto flex h-16 items-center px-4">
				<Link href="/" className="text-xl font-bold text-primary">
					Thai Agri Prices
				</Link>
				<div className="ml-auto flex gap-6">
					<Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
						Dashboard
					</Link>
				</div>
			</div>
		</nav>
	);
}
